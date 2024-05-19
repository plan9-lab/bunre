#!/usr/bin/env bun
import bunrePckg from './package.json' assert { type: 'json' };
import { join } from 'node:path';
import fs from 'node:fs';

function log(...args: any[]) {
    console.log(`\x1b[34m[${bunrePckg.name}]\x1b[0m`, ...args);
}

const cwd = process.cwd();
const pkgPath = join(cwd, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version.split('.').map((v: string) => parseInt(v));

log(bunrePckg.name, bunrePckg.version);
log(pkg.name, pkg.version);

const gitStatusOutput = await Bun.$`git status --porcelain`.text();
const gitLogOutput = await Bun.$`git log --oneline`.text();

if (gitStatusOutput.trim() !== "") {
    log("git status is not clean. commit or stash changes first");
    // process.exit(1);
}

if (gitLogOutput.trim() === "") {
    log("git log is empty");
    // process.exit(1);
}