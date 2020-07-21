import { Character, Featurable } from "../character";
import { CharacterElement } from "./element";
import { Feature } from "./feature";
import { Weapon } from "../weapon";
import { json } from "@utils/json_utils";
import * as gcs from "@gcs/gcs";
export declare abstract class ListItem<T extends Featurable> extends CharacterElement<T> implements gcs.ListItem<T> {
    #private;
    abstract version: number;
    abstract tag: string;
    abstract name: string;
    list: List<T>;
    canContainChildren: boolean;
    open: boolean;
    children: Set<ListItem<T>>;
    isContained: boolean;
    containedBy: T;
    features: Set<Feature<T>>;
    weapons: Set<Weapon<T>>;
    listIndex: number;
    constructor(list: List<T>);
    abstract isActive(): boolean;
    getListDepth(): number;
    getCharacter(): Character;
    isContainer(): boolean;
    isContainerOpen(): boolean;
    isVisible(): boolean;
    previousVisibleSibling(): void;
    nextVisibleSibling(): void;
    toggle(): void;
    openContainer(): void;
    closeContainer(): void;
    depth(): void;
    index(): void;
    iterChildren(): ListItem<T>[];
    addChild(child?: T): T;
    removeChild(child: string | T): void;
    getRecursiveChildren(): void;
    findSelf(): T;
    toJSON(): Object;
    loadJSON(json: string | json): void;
    private loadChildren;
    load<U>(loader: (subject: T, data?: U) => U[], data: any): T;
}
export declare abstract class List<T extends Featurable> {
    #private;
    contents: Set<T>;
    abstract populator: new (list: List<T>) => T;
    abstract loader: (subject: T, data?: T) => T[];
    character: Character;
    constructor(character: Character);
    generate(): void;
    addListItem(item?: T | ListItem<T>): T;
    removeListItem(item: T): void;
    getByIndex(index: number): T;
    getByUUID(uuid: string): T;
    iter(): T[];
    iterTop(): T[];
    keys(): T[];
    load(data: string | json): this;
}
