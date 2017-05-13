import {emptyDirSync, removeSync, writeFileSync} from "fs-extra";
import {join} from "path";

export interface IDefinition {
    [key: string]: string | Buffer | IDefinition;
}

export function createTree (root: string, definition: IDefinition): void {
    emptyDirSync(root);
    Object.keys(definition).forEach(key => {
        const path = join(root, key);
        const value = definition[key];
        if (typeof value === "string" || Buffer.isBuffer(value)) {
            writeFileSync(path, value);
        } else {
            createTree(path, value);
        }
    });
}

export function destroyTree (root: string): void {
    removeSync(root);
}
