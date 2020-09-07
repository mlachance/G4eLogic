import { Feature } from "./misc/feature";
import { Character, Signature } from "./character";
import { FeatureType } from "@gcs/gcs";
import { Featurable } from "@character/character";
import { CharacterElement } from "./misc/element";
import { Collection } from "./misc/collection";

export class AttributeList {
    static keys = []
    character: Character
    attributes: Collection<Signature, Attribute> = new Collection

    constructor(character: Character, keys: string[] = []) {
        this.character = character
        this.configureAttributes();
        this.character.hooks.on("reconfigure", this.configureAttributes);
    }

    private configureAttributes() {
        const CONFIG = this.character.config;
        this.attributes.clear();
        CONFIG.attributes.forEach(attribute => {
            const basedOn = new Function(attribute.based_on).bind(this);
            this.addAttribute({
                signature: attribute.signature,
                costPerLevel: attribute.cost_per_level,
                defaultLevel: attribute.default_level,
                basedOn: attribute.basedOn === undefined ? () => null : basedOn
            })
        });
    }

    signatureOptions() { return Array.from(this.attributes).map(attribute => attribute.name) }

    getAttribute(attribute: Signature) {
        return this.attributes.get(attribute)
    }

    addAttribute({ signature, costPerLevel = 0, defaultLevel = 0, basedOn = () => null }): Attribute {
        if (typeof signature === "string") {
            const attribute = new Attribute(signature, this.character, costPerLevel, { defaultLevel, basedOn });
            this.attributes.set(signature as Signature, attribute);
            return attribute
        }
    }
}

export class Attribute extends CharacterElement<Attribute> {
    static keys = ["name", "level", "costPerLevel", "defaultLevel"]
    name: string
    character: Character
    level: number
    costPerLevel: number
    defaultLevel: number
    basedOn: () => number

    constructor(
        name: string,
        character: Character,
        costPerLevel: number,
        {
            defaultLevel = 0,
            basedOn = () => 0
        },
        keys: string[] = []
    ) {
        super(character, [...keys, ...Attribute.keys]);
        this.name = name;
        this.character = character;
        this.level = defaultLevel;
        this.costPerLevel = costPerLevel;
        this.defaultLevel = defaultLevel;
        this.basedOn = basedOn;
    }

    setLevel(level: number) { if (level || level === 0) this.level = level; return level }
    setLevelDelta() { }

    getMod() { return this.getModList().reduce((prev, cur) => prev + cur.getBonus(), 0) }
    getModList(): AttributeBonus<any>[] {
        const attributeName = this.name;
        return this.character.featureList.getFeaturesByType(FeatureType.attributeBonus).filter(
            feature => feature instanceof AttributeBonus && feature.ownerIsActive() && feature.attribute.toLowerCase() === attributeName.toLowerCase()
        ) as AttributeBonus<any>[]
    }

    pointsSpent() { return this.levelsIncreased() * this.costPerLevel }
    levelsIncreased() { return this.level - this.defaultLevel }
    calculateLevel() { return this.level + this.getMod() + this.basedOn() }

    get displayLevel() { return this.calculateLevel() }
    set displayLevel(level) {
        const mod = this.getMod();
        if (this.defaultLevel) {
            this.level = level - mod;
        } else if (!this.defaultLevel && this.basedOn) {
            this.level = level - this.basedOn() - mod;
        }
    }
}

export class AttributeBonus<T extends Featurable> extends Feature<T> {
    static type = FeatureType.attributeBonus
    static keys = ["attribute"]

    attribute: string
    constructor(owner: T, keys: string[] = []) {
        super(owner, [...keys, ...AttributeBonus.keys]);
    }
}