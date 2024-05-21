import { Console } from 'node:console'
import { $ } from 'bun'

class Bunlo extends Console {
    static log = console.log
    static info = console.info
    static warn = console.warn
    static error = console.error
}

abstract class Bunre {
    static async conventionalLog() {
        // git log uncommited changes in short format
        const gitLogOutput = await $`git log origin..HEAD --oneline`.text()
        Bunlo.log('git log', gitLogOutput)
    }
}

console.log('yo', await Bunre.conventionalLog())