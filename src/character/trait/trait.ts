import { Modifier } from "../misc/modifier";
import { List, ListItem } from "../misc/list";
import { Character } from "../character";
import { Feature } from "../misc/feature";
import { getAdjustedPoints } from "./logic";


export class TraitList extends List<Trait> {
    constructor() {
        super("trait");
    }

    populator(data: any) {
        return new Trait(this)
    }

    private sumMatching(match: (trait: Trait) => boolean, { activeOnly = true }) {
        return this.iter().reduce((prev, cur) => {
            if (match(cur) && activeOnly) prev += cur.adjustedPoints()
            return prev
        }, 0)
    }

    sumRacials({ activeOnly = true } = {}) {
        return this.sumMatching(
            (trait) => trait.isRacial(),
            { activeOnly })
    }
    sumAdvantages({ activeOnly = true } = {}) {
        return this.sumMatching(
            (trait: Trait) =>
                !trait.isRacial() &&
                trait.adjustedPoints() > 1,
            { activeOnly })
    }
    sumDisadvantages({ activeOnly = true } = {}) {
        return this.sumMatching(
            (trait: Trait) =>
                !trait.isRacial() &&
                trait.adjustedPoints() < -1,
            { activeOnly })
    }
    sumQuirks({ activeOnly = true } = {}) {
        return this.sumMatching(
            (trait: Trait) => !trait.isRacial() && trait.adjustedPoints() === -1,
            { activeOnly })
    }
}

enum ContainerType {
    group = "",
    metaTrait = "meta trait",
    race = "race",
    alternativeAbilities = "alternative abilities"
}

export class Trait extends ListItem {
    static keys = ["name", "basePoints", "hasLevels", "levels", "allowHalfLevels", "hasHalfLevel", "roundDown", "controlRating", "types", "disabled", "pointsPerLevel", "containerType"]
    version = 1
    tag = "trait"

    name: string = ""
    basePoints: number = 0

    hasLevels: boolean = false
    levels: number = null
    allowHalfLevels: boolean = false
    hasHalfLevel: boolean = false
    roundDown: boolean = false

    controlRating: ControlRollMultiplier = ControlRollMultiplier.noneRequired

    types: Set<TraitType> = new Set()

    pointsPerLevel: number = null

    containerType: ContainerType = null

    modifiers: Set<TraitModifier> = new Set()

    constructor(list: List<Trait>, keys: string[] = []) {
        super(list, [...keys, ...Trait.keys]);
    }

    isActive() { return !this.disabled }
    getLevel() { return this.levels }

    isRacial(): boolean {
        if (!this.containedBy) {
            return false
        }
        if (this.containedBy.containerType === ContainerType.race) {
            return true
        } else {
            return this.containedBy.isRacial();
        }
    }
    isAdvantage() { return this.adjustedPoints() > 1 || this.categories.has("Advantage") }
    isPerk() { return this.basePoints === 1 || this.pointsPerLevel === 1 || this.categories.has("Perk") }
    isDisadvantage() { return this.adjustedPoints() < 1 || this.pointsPerLevel === -1 || this.categories.has("Disadvantage") }
    isQuirk() { return this.basePoints === -1 || this.categories.has("Quirk") }
    isFeature() { return this.basePoints === 0 || this.categories.has("Feature") }

    static getCRMultipland(cr: ControlRollMultiplier) {
        switch (cr) {
            case ControlRollMultiplier.cannotResist: return 2.5
            case ControlRollMultiplier.resistRarely: return 2
            case ControlRollMultiplier.resistFairlyOften: return 1.5
            case ControlRollMultiplier.resistQuiteOften: return 1
            case ControlRollMultiplier.resistAlmostAlway: return 0.5
            default: return 1
        }
    }

    adjustedPoints() {
        if (this.isContainer()) {
            return [...this.children].reduce((prev, cur) => prev + cur.adjustedPoints(), 0)
        } else {
            return getAdjustedPoints(this.modifiers, this.basePoints, this.hasLevels, this.hasHalfLevel, this.pointsPerLevel, this.levels, this.roundDown, Trait.getCRMultipland(this.controlRating))
        }
    }

    addModifier(): TraitModifier {
        const modifier = new TraitModifier(this);
        this.modifiers.add(modifier);
        return modifier
    }
}

export class TraitModifier extends Modifier<Trait> {
    static keys = ["cost", "type", "levels", "hasLevels", "affects"]
    tag: string = "modifier"
    version: number = 1

    cost: number
    type: TraitModifierType
    levels: number
    affects: TraitModifierAffects

    hasLevels: boolean = false

    constructor(owner: Trait, keys = []) {
        super(owner, [...keys, ...TraitModifier.keys])
    }

    costModifier() {
        return this.hasLevels && this.levels > 0 ? this.cost * this.levels : this.cost
    }

    static modifyPoints(points: number, modifier: number) {
        return points + TraitModifier.calculateModifierPoints(points, modifier);
    }
    static calculateModifierPoints(points: number, modifier: number) {
        return points * (modifier / 100)
    }
    static applyRounding(value: number, roundCostDown: boolean) {
        return roundCostDown ? Math.floor(value) : Math.ceil(value)
    }
}

export enum TraitModifierType {
    percentage = "percentage",
    leveledPercentage = "leveled_percentage",
    points = "points",
    multiplier = "multiplier",
}

export enum TraitModifierAffects {
    base = "base_only",
    levels = "levels_only",
    total = "total"
}

export enum TraitType {
    mental = "Mental",
    physical = "Physical",
    social = "Social",
    exotic = "Exotic",
}

export enum ControlRollMultiplier {
    cannotResist = "none",
    resistRarely = "6",
    resistFairlyOften = "9",
    resistQuiteOften = "12",
    resistAlmostAlway = "15",
    noneRequired = "n/a"
}