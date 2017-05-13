import {expect} from "chai";
import * as fs from "fs-extra";
import {tmpdir} from "os";
import {join} from "path";

import {destroyTree} from "../src";

describe("destroyTree", () => {

    const root = join(tmpdir(), "root");

    it("rm -rf a directory", () => {
        fs.ensureDirSync(root);
        fs.ensureDirSync(join(root, "directory"));
        fs.writeFileSync(join(root, "file"), "content");
        destroyTree(root);
        expect(
            fs.existsSync(join(root, "directory"))
        ).to.equal(false);
        expect(
            fs.existsSync(join(root, "file"))
        ).to.equal(false);
        expect(
            fs.existsSync(root)
        ).to.equal(false);
    });

});
