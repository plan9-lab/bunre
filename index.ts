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

function log(...args: any[]) {
    args = args.map((arg: string) => {
        if (arg.includes('\n')) {
            return '\n' + arg
        }
        return arg;
    });
    console.log(`\x1b[34m[${bunrePckg.name}]\x1b[0m`, ...args);
}

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
    //process.exit(1);
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

    log(newVersion)
}



// if (gitStatusOutput.trim() !== "") {
//     log("git status is not clean. commit or stash changes first");
//     // process.exit(1);
// }


