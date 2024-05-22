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
    static log = console.log
    static info = console.info
    static warn = console.warn
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
Bunlo.log(Bunre.parseConventionalCommits(logOutput))
