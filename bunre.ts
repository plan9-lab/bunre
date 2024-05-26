import { Console } from 'node:console'
import { $ } from 'bun'

const _lines = async (bun$Output: any) => {
    return (
        await bun$Output.text())
        .trim()
        .split('\n')
        .map((line: string) => line.trim()
        )
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
            if (arg.constructor.name) {
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
    static async log() {
        // git log uncommited changes in short format
        const gitLogOutput = await _lines($`git log origin..HEAD --oneline`)
        return gitLogOutput
    }

    static parseConventionalCommits(gitLogOutput: string[]) {
        for (const line of gitLogOutput) {
            const parts = line.split(/:feat/)
            console.log(parts)
        }

    }
}

const logOutput = await Bunre.log()
Bunlo.log(Bunre.log())
//Bunlo.log(Bunre.parseConventionalCommits(logOutput))
