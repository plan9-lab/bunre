import fs from 'node:fs'
import { join } from 'node:path'

abstract class Bunre {
    static _packageFilePath = join(process.cwd(), 'package.json')
    static _package = JSON.parse(
        fs.readFileSync(Bunre._packageFilePath, 'utf-8')
    )

    static git = {
        async status() {
            return await Bun.$`git status --short`.text()
        },

        async log() {
            return await Bun.$`git log origin..HEAD --oneline`.text()
        }
    }

    static package = {
        version: {
            current: Bunre._package.version,

            parse() {
                return Bunre._package.version.split('.').map(Number)
            },

            bump(hasPatch = false, hasMinor = false, hasMajor = false) {
                const [major, minor, patch] = Bunre.package.version.parse()

                // if (hasMajor) {
                //     return `${Number(major) + 1}.0.0`
                // } else if (hasMinor) {
                //     return `${major}.${Number(minor) + 1}.0`
                // } else if (hasPatch) {
                //     return `${major}.${minor}.${Number(patch) + 1}`
                // }
                if (hasMajor) {
                    return `${major + 1}.0.0`
                } else if (hasMinor) {
                    return `${major}.${minor + 1}.0`
                } else if (hasPatch) {
                    return `${major}.${minor}.${patch + 1}`
                } else {
                    return Bunre.package.version.current
                }
            }
        }
    }
}

const gitStatusOutput = await Bunre.git.status()
const gitLogOnelineOutput = await Bunre.git.log()
const commitPrefixes = {
    major: ['BREAKING CHANGE', 'major'],
    minor: ['feat', 'minor'],
    patch: ['fix', 'patch', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']
}

console.log(gitLogOnelineOutput)