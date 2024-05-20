# Bunre

Bun Release Manager For Git

## Usage

### Install

https://bun.sh

In terminal:

```sh
bunx https://github.com/plan9-lab/bunre
```

This will:

- try to create a random tag
- check if you have write access to the repo
- if you have commits tagged with breaking, feat, fix, chore, docs, test, then it will update the package.json version accordingly
- commit and push the changes
- push the new tag
- push the new tag to origin
- if there is no conventional commits, then it will comit chore: progress and exit
