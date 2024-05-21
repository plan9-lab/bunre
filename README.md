# Bunre

Bun Release Manager For Git.

!!! IMPORTANT !!! This is a work in progress. Not tested on windows yet.

At the moment this is a proof of concept. It's working good to release without feature branching.

## Usage

### Install

https://bun.sh

In terminal:

```sh
bunx https://github.com/plan9-lab/bunre
```

This will:

- try to create a random tag to check if you have write access to the repo and then delete it
- if you have commits tagged with breaking, feat, fix, chore, docs, test, then it will update the package.json version accordingly
- commit and push the changes
- push the new tag
- push the new tag to origin
- if there is no conventional commits, then it will comit chore: progress and exit

## Links

- https://www.npmjs.com/package/inquirer
- https://www.conventionalcommits.org/en/v1.0.0
- https://www.npmjs.com/package/husky

## Roadmap

- [ ] add tests
- [ ] dry run mode should be default
- [ ] release notes should be generated in MD files
- [ ] add support for feature branches
- [ ] add command line tools
- [ ] when git status returns only MD automaticaly generate docs: ... commit and push
- [ ] cli task manager with https://www.npmjs.com/package/inquirer
- [ ] husky pre-commit hook setup: run lint and test before commit
