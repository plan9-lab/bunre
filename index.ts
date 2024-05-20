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
import assert from 'node:assert';
import { $ } from 'bun'

async function _(bun$Output: any) {
    return (await bun$Output.text()).trim()
}

function log(...args: any[]) {
    console.log(`\x1b[34m[${bunrePckg.name}]\x1b[0m`, ...args);
}

function info(...args: any[]) {
    args = args.map((arg) => `\x1b[2m${arg}\x1b[0m`)
    console.log(`\x1b[2m[${bunrePckg.name}]\x1b[0m`, ...args);
}

const cwd = process.cwd()
const pckg = JSON.parse(fs.readFileSync(join(cwd, 'package.json'), 'utf8'));
const pckgVer = pckg.version

assert(pckgVer, 'package.json version is not defined')

const pckgVerParts = pckgVer.split('.') // major.minor.patch

log('cwd', cwd)
info('bunre version', bunrePckg.version)
log('current package name', pckg.name)
log('current package version', pckgVer)

const gitFetchOriginOutput = await _($`git fetch origin`)
log('git fetch origin', gitFetchOriginOutput)

const gitStatusOutput = await _($`git status --short`)
log('git status', gitStatusOutput)

const gitLogOnelineOutput = await _($`git log origin..HEAD --oneline`)
log('git log origin..HEAD', '\n', gitLogOnelineOutput)

if (gitLogOnelineOutput.includes('breaking:')) {
    pckgVerParts[0]++
    pckgVerParts[1] = 0
    pckgVerParts[2] = 0
} else if (gitLogOnelineOutput.includes('feat:')) {
    pckgVerParts[1]++
    pckgVerParts[2] = 0
} else if (gitLogOnelineOutput.includes('fix:')) {
    pckgVerParts[2]++
} else if (gitLogOnelineOutput.includes('chore:')) {
    pckgVerParts[2]++
} else if (gitLogOnelineOutput.includes('docs:')) {
    pckgVerParts[2]++
}

const newVersionName = pckgVerParts.join('.')
log('new version name', newVersionName)

const newTagName = `v${newVersionName}`
log('new tag name', newTagName)

if (newVersionName !== pckgVer) {
    pckg.version = newVersionName

    log('updating package.json', newVersionName)
    fs.writeFileSync(join(cwd, 'package.json'), JSON.stringify(pckg, null, 2))

    const gitAddPckgOutput = await _($`git add package.json`)
    log('git add package.json', gitAddPckgOutput)

    const gitCommitChoreOutput = await _($`git commit -m "release: ${newTagName}"`)
    log(`git commit -m "release: ${newTagName}"`, gitCommitChoreOutput)
} else {
    // git add .
    const gitAddallOutput = await _($`git add .`)
    log('git add .', gitAddallOutput)

    // git commit -m "chore: progress"
    const gitCommitChoreOutput = await _($`git commit -m "chore: progress"`)
    log('git commit -m "chore: progress"', gitCommitChoreOutput)

    const gitPushChoreOutput = await _($`git push origin`)
    log('git push origin', gitPushChoreOutput)

    log('pushed chore: progress and exitiong. no significant changes')
    process.exit(0)
}

try {
    await _($`git show ${newTagName}`)
    await _($`git tag -d ${newTagName}`)
    await _($`git push origin --delete ${newTagName}`)
} catch (e: any) {
    log(`no tag named ${newTagName}`)
    if (e.info.exitCode !== 128) {
        throw e
    }
}

const gitTagAddOutput = await _($`git tag -a ${newTagName} -m "release: ${newTagName}"`)
log('git tag -a', gitTagAddOutput)

const gitTagPushOutput = await _($`git push origin`)
log('git push origin', gitTagPushOutput)

const gitPushTagsOutput = await _($`git push origin --tags`)
log('git push origin --tags', gitPushTagsOutput)
