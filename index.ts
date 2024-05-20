#!/usr/bin/env bun

/**
 * @package bunre
 * Bun Git Release Manager
 *
 * Known issues:
 */

import bunrePckg from './package.json' assert { type: 'json' };
import { join } from 'node:path';
import fs from 'node:fs';

// function log(...args: any[]) {
//     console.log(`\x1b[34m[${bunrePckg.name}]\x1b[0m`, ...args);
// }

const log = console.log
const $log = async (...args: any[]) => {
    args = await Promise.all(args.map(async (arg) => await arg.text()));
    args = args.map((arg) => arg.trim());
    log(...args);
}

const cwd = process.cwd();
const pkgPath = join(cwd, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version.split('.').map((v: string) => parseInt(v));
const newVersion = [...version];

log(bunrePckg.name, bunrePckg.version);
log(pkg.name, pkg.version);

const gitStatusOutput = await Bun.$`git status --porcelain`.text();
const gitLogOutput = await Bun.$`git log origin..HEAD --oneline`.text();

if (gitLogOutput.trim() === "") {
    log("git log is empty.");
} else {
    if (gitLogOutput.includes('breaking:')) {
        newVersion[0]++;
        newVersion[1] = 0;
        newVersion[2] = 0;
    } else if (gitLogOutput.includes('feat:')) {
        newVersion[1]++;
        newVersion[2] = 0;
    } else if (gitLogOutput.includes('fix:') || gitLogOutput.includes('docs:') || gitLogOutput.includes('test:')) {
        newVersion[2]++;
    }
    log('git log origin..HEAD --oneline', gitLogOutput)
    log('new version', newVersion)
}

const newVersionStr = newVersion.join('.');
const versionIsSignificant = newVersionStr !== pkg.version;
log('new versionStr', newVersionStr, versionIsSignificant)
if (versionIsSignificant) {
    // git add tag
    log("comminting version", newVersionStr)
    // git delete tag
    // git delete tag from origin
    try {
        await Bun.$`git tag -d v${newVersionStr}`.text();
        await Bun.$`git push --delete origin v${newVersionStr}`.text();
    } catch (e) {
        log('no tag to delete')
    }
    //log('git tag -d v${newVersionStr}', gitPushTagsOutput)
    await Bun.$`git tag -a v${newVersionStr} -m "release: v${newVersionStr}"`.text();
    //git push
    const gitPushOriginOutput = await Bun.$`git push origin v${newVersionStr}`.text();
    log('git push origin', gitPushOriginOutput)
    // git push tags
    const gitPushTagsOutput = await Bun.$`git push origin --tags`.text();
    log('git push origin --tags', gitPushTagsOutput)

} else if (gitStatusOutput.trim() !== "") {
    log("git status is not clean. commiting chore: progress");
    log('git status', gitStatusOutput)
    const gitAddallOutput = await Bun.$`git add .`.text();
    const gitCommitChoreOutput = await Bun.$`git commit -m "chore: progress"`.text();

    log('git add .', gitAddallOutput)
    log('git commit -m "chore: progress"', gitCommitChoreOutput)

    try {
        const gitPushChoreOutput = await Bun.$`git push origin`.text();
        log('git push', gitPushChoreOutput)
        log('pushed chore: progress')
    } catch (e) {
        log('please check your ~/.ssh/config and update origin in ./.git/config or check keys settings if you are using tools like gitkraken')
        log('git push', e)
    }
} 