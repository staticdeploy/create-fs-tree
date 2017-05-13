[![npm version](https://badge.fury.io/js/create-fs-tree.svg)](https://badge.fury.io/js/create-fs-tree)
[![Build Status](https://travis-ci.org/staticdeploy/create-fs-tree.svg?branch=master)](https://travis-ci.org/staticdeploy/create-fs-tree)
[![Coverage Status](https://img.shields.io/coveralls/staticdeploy/create-fs-tree.svg)](https://coveralls.io/r/staticdeploy/create-fs-tree?branch=master)
[![Dependency Status](https://david-dm.org/staticdeploy/create-fs-tree.svg)](https://david-dm.org/staticdeploy/create-fs-tree)
[![devDependency Status](https://david-dm.org/staticdeploy/create-fs-tree/dev-status.svg)](https://david-dm.org/staticdeploy/create-fs-tree#info=devDependencies)

# create-fs-tree

Create a filesystem tree from a definition. This module is intended to use in
unit/e2e tests to create a pre-determined fs trees.

## Use

You probably want to install this as an npm dev dependency:

```sh
npm install --save-dev create-fs-tree
```

Use it in your tests:

```js
import {expect} from "chai";
import {createTree, destroyTree} from "create-fs-tree";
import {readFileSync} from "fs";
import {tmpdir} from "os";
import {join} from "path";

describe("my test subject", () => {

    const dir = join(os.tmpdir(), "root");

    before(() => {
        createTree(dir, {
            "file": "file content",
            "other-file": Buffer.from("other-file content"),
            "sub-dir": {
                "sub-file": "sub-file content"
            }
        });
    });
    after(() => {
        destroyTree(dir);
    });

    it("my test", () => {
        expect(
            readFileSync(join(dir, "file"))
        ).to.equal("file content");
    });

});
```

## API

### createTree(root, definition)

Creates under the `root` directory a fs tree as specified in the `definition`.
> WARNING: `createTree` **removes** the `root` directory before creating the
specified fs tree.

##### Arguments

- `root` **string**: root directory under which the fs tree is created. The
  directory is created if it doesn't exist, it's emptied if it already exists
- `definition` **object**: an object describing the fs tree to create. Its
  properties' values can either be:
  - strings or buffers: in which case a file with the property key as name and
    the property value as content will be created
  - definition objects: in which case a directory with the property key as name
    will be created, and under it a fs tree as described by the property value
    (which of course is a definition object)

##### Returns

Nothing.

##### Example

```ts
createTree("mydir", {
    "level-0-file": Buffer.from("level-0-file content\n"),
    "level-0-dir": {
        "level-1-file": "level-1-file content\n",
        "level-1-dir": {}
    }
});
```

Creates a fs tree so that:

```sh
$ tree mydir
mydir
├── level-0-file
└── level-0-dir
    ├── level-1-file
    └── level-1-dir
$ cat mydir/level-0-file
level-0-file content
$ cat mydir/level-0-dir/level-1-file
level-1-file content
```

---

### destroyTree(root)

Removes the `root` path. Equivalent to `rm -rf`.

##### Arguments

- `root` **string**: path to remove

##### Returns

Nothing.

## Contribute

See [CONTRIBUTING](./CONTRIBUTING.md).
