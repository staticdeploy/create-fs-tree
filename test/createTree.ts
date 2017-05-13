import {expect} from "chai";
import * as fs from "fs-extra";
import {tmpdir} from "os";
import {join} from "path";

import {createTree} from "../src";

function isFile (path: string) {
    try {
        return fs.statSync(path).isFile();
    } catch (err) {
        return false;
    }
}
function isDirectory (path: string) {
    try {
        return fs.statSync(path).isDirectory();
    } catch (err) {
        return false;
    }
}

describe("createTree", () => {

    const root = join(tmpdir(), "root");
    afterEach(() => {
        fs.removeSync(root);
    });

    describe("creates files and directories according to the passed-in definition", () => {

        beforeEach(() => {
            createTree(root, {
                "level-0-file": "level-0-file content",
                "level-0-directory": {
                    "level-1-file": "level-1-file content",
                    "level-1-directory": {
                        "level-2-file": "level-2-file content",
                        "level-2-directory": {}
                    }
                },
                "empty-directory": {},
                "string-file": "string content",
                "buffer-file": Buffer.from("buffer content")
            });
        });

        it("test: top-level file", () => {
            const path = join(root, "level-0-file");
            expect(
                isFile(path)
            ).to.equal(true);
            expect(
                fs.readFileSync(path, "utf8")
            ).to.equal("level-0-file content");
        });

        it("test: top-level directory", () => {
            const path = join(root, "level-0-directory");
            expect(
                isDirectory(path)
            ).to.equal(true);
        });

        describe("test: sub-level file", () => {
            it("case: level 1", () => {
                const path = join(root, "level-0-directory", "level-1-file");
                expect(
                    isFile(path)
                ).to.equal(true);
                expect(
                    fs.readFileSync(path, "utf8")
                ).to.equal("level-1-file content");
            });
            it("case: level 2", () => {
                const path = join(root, "level-0-directory", "level-1-directory", "level-2-file");
                expect(
                    isFile(path)
                ).to.equal(true);
                expect(
                    fs.readFileSync(path, "utf8")
                ).to.equal("level-2-file content");
            });
        });

        describe("test: sub-level directory", () => {
            it("case: level 1", () => {
                const path = join(root, "level-0-directory", "level-1-directory");
                expect(
                    isDirectory(path)
                ).to.equal(true);
            });
            it("case: level 2", () => {
                const path = join(root, "level-0-directory", "level-1-directory", "level-2-directory");
                expect(
                    isDirectory(path)
                ).to.equal(true);
            });
        });

        it("test: empty directory", () => {
            const path = join(root, "empty-directory");
            expect(
                isDirectory(path)
            ).to.equal(true);
        });

        it("test: string file content", () => {
            const path = join(root, "string-file");
            expect(
                isFile(path)
            ).to.equal(true);
            expect(
                fs.readFileSync(path, "utf8")
            ).to.equal("string content");
        });

        it("test: buffer file content", () => {
            const path = join(root, "buffer-file");
            expect(
                isFile(path)
            ).to.equal(true);
            expect(
                fs.readFileSync(path, "utf8")
            ).to.equal("buffer content");
        });

    });

    it("empties the root directory before creating the tree", () => {
        fs.ensureDirSync(root);
        fs.ensureDirSync(join(root, "pre-existing-directory"));
        fs.writeFileSync(join(root, "pre-existing-file"), "content");
        createTree(root, {
            file: "content"
        });
        expect(
            fs.existsSync(join(root, "pre-existing-directory"))
        ).to.equal(false);
        expect(
            fs.existsSync(join(root, "pre-existing-file"))
        ).to.equal(false);
        expect(
            isFile(join(root, "file"))
        ).to.equal(true);
    });

});
