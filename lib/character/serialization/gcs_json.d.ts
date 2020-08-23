import { Serializer } from "./serializer";
import { Skill, SkillDefault, Technique } from "../../character/skill/skill";
import { Spell } from "../../character/spell";
import { Equipment } from "../../character/equipment";
import { Trait } from "../../character/trait";
import * as gcs from "@gcs/gcs";
import { json } from "@utils/json_utils";
import { Character, Featurable } from "@character/character";
import { Feature } from "@character/misc/feature";
import { List } from "@character/misc/list";
import { Modifier, Modifiable } from "@character/misc/modifier";
import { Weapon } from "../weapon";
export declare class GCSJSON extends Serializer {
    static scope: string;
    constructor();
    init(): void;
    private static saveListLike;
    private static mapSkillLike;
    mapSkillDefault(skillDefault: SkillDefault<any>, data: any): SkillDefault<any>;
    saveSkillDefault(skillDefault: SkillDefault<any>): any;
    mapSkill(skill: Skill, data?: gcs.Skill): gcs.Skill[];
    saveSkill(skill: Skill): any;
    mapTechnique(technique: Technique, data?: gcs.Technique): any;
    saveTechnique(technique: Technique): any;
    mapSpell(spell: Spell, data?: gcs.Spell): json[];
    saveSpell(spell: Spell): any;
    mapEquipment(equipment: Equipment, data?: gcs.Equipment): gcs.Equipment[];
    saveEquipment(equipment: Equipment): any;
    mapTrait(trait: Trait, data?: json): json[];
    saveTrait(trait: Trait): any;
    mapFeature(feature: Feature<Featurable>, data: json): Feature<Featurable>;
    saveFeature(feature: Feature<Featurable>): any;
    mapModifier(modifier: Modifier<Modifiable>, data: json): Modifier<Modifiable>;
    saveModifier(modifier: Modifier<Modifiable>): any;
    mapWeapon(weapon: Weapon<any>, data: any): Weapon<any>;
    saveWeapon(): void;
    loadList(list: List<any>, data: any[]): List<any>;
    saveList(list: List<Featurable>): any[];
    load(character: Character, data: any): Character;
    save(character: Character, target: any): any;
}
