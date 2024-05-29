import { Console } from 'node:console'
import { $ } from 'bun'
import { parseCommit, parseSemver } from '@/lib/parsers'
import fs from 'node:fs'
import { join } from 'node:path'

const cwd = process.cwd()
let pckg
try {
    pckg = JSON.parse(fs.readFileSync(join(cwd, 'package.json'), 'utf8'));
} catch (e: any) {
    throw new Error(`package.json not found in ${cwd}`)
}

// Utility that parses Bun$ output to array of strings
const _lines = async (bun$Output: any) => {
    return (await bun$Output.text())
        .trim()
        .split('\n')
        .map((line: string) => line.trim())
}

class Bunlo extends Console {

    static ansiColorsCodes = {
        reset: '\x1b[0m',
        bold: '\x1b[1m',
        dim: '\x1b[2m',
        italic: '\x1b[3m',
        underline: '\x1b[4m',
        inverse: '\x1b[7m',
        hidden: '\x1b[8m',
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        gray: '\x1b[90m',
        bgBlack: '\x1b[40m',
        bgRed: '\x1b[41m',
        bgGreen: '\x1b[42m',
        bgYellow: '\x1b[43m',
        bgBlue: '\x1b[44m',
        bgMagenta: '\x1b[45m',
        bgCyan: '\x1b[46m',
        bgWhite: '\x1b[47m',
    }

    static getDefaultLogName = () => 'bunlo'


    static log = (...args: any[]) => {

        args.forEach((arg) => {
            if (arg.constructor.name === 'Promise') {
                Bunlo.warn(
                    `you are using promise in log. this will be logged in the moment when promise is resolved. this is not the same as console.log.`,
                    `if you want to log promise use await Bunre.logAsync(...arg)`
                )
            }
        })

        Promise
            .all(args)
            .then((args) => {
                return console.log(
                    `\x1b[34m[${Bunlo.getDefaultLogName()}]\x1b[0m`,
                    ...args
                )
            })
    }
    static info = console.info
    static warn = (...args: any[]) => {
        Promise
            .all(args)
            .then((args) => console.warn(`\x1b[33m[${Bunlo.getDefaultLogName()}]\x1b[0m`, ...args))
    }
    static error = console.error
}

abstract class Bunre {
    /**
     * @returns gets git log origin..HEAD --oneline in short format and returns it as trimmed string array
     */
    static async gitLogShort() {
        // git log uncommited changes in short format
        const gitLogOutput = await _lines($`git log origin..HEAD --oneline`)
        return gitLogOutput
    }

    static parseConventionalCommits(gitLogOutput: string[]) {
        const conventionalCommits = gitLogOutput.map(
            (line: string) => parseCommit(line)).filter((commit: any) => commit !== null
            )

        return conventionalCommits
    }
}

const majors = ['breaking', 'major']
const minors = ['feat', 'minor']
const patches = ['fix', 'patch', 'docs', 'chore', 'test', 'refactor', 'perf', 'build', 'ci', 'revert', 'style', 'types', 'workflow']

const logOutput = await Bunre.gitLogShort()
const newVersion = parseSemver(pckg.version)

const parsedLog = logOutput.map((line: string) => parseCommit(line))
console.log(parsedLog)


Bunlo.log('current version', parseSemver(pckg.version))
Bunlo.log('new version', newVersion)
