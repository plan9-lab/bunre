import fs from 'node:fs'
import { join } from 'node:path'

abstract class Bunre {
    static _packageFilePath = join(process.cwd(), 'package.json')
    static _package = JSON.parse(
        fs.readFileSync(Bunre._packageFilePath, 'utf-8')
    )

    static git = {
        /** Returns an array of git status output lines in short format */
        async status() {
            return await Bun.$`git status --short`.text()
        },

        /** Returns an array of git log output lines in short format without empty lines */
        async log() {
            return (await Bun.$`git log origin..HEAD --oneline`.text())
                .split('\n')
                .map(line => line.trim())
                .filter(Boolean)
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

const hasReleaseParam = process.argv.includes('--release')
const gitLogOnelineOutput = await Bunre.git.log()
const commitPrefixes = {
    major: ['BREAKING CHANGE', 'major'],
    minor: ['feat', 'minor'],
    patch: ['fix', 'patch', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']
}

/** Reurns [hasMajor, hasMinor, hasPatch] depending on commits in git log output */
const processLogOutpput = (logOutput: string[]) => {
    return logOutput.reduce((acc, line) => {
        if (commitPrefixes.major.some(prefix => line.includes(prefix))) {
            acc[0] = true
        } else if (commitPrefixes.minor.some(prefix => line.includes(prefix))) {
            acc[1] = true
        } else if (commitPrefixes.patch.some(prefix => line.includes(prefix))) {
            acc[2] = true
        }
        return acc
    }, [false, false, false])
}

const bumpedVersion = Bunre.package.version.bump(...processLogOutpput(gitLogOnelineOutput))

console.log('Release:', hasReleaseParam)
console.log('Current version:', Bunre.package.version.current)
console.log('Bumped version:', bumpedVersion)
console.log('Changes:', gitLogOnelineOutput.join('\n'))
console.log('Pass --release param this will add annotated tag to the commit and push it to the origin')

if (bumpedVersion !== Bunre.package.version.current) {
    fs.writeFileSync(Bunre._packageFilePath, JSON.stringify({
        ...Bunre._package,
        version: bumpedVersion
    }, null, 2))

    if (hasReleaseParam) {
        const pushOutput = await Bun.$`git add package.json && git tag -a v${bumpedVersion} -m "release: v${bumpedVersion}" && git push origin && git push --tags`
        console.log(pushOutput)
    }
} else {
    console.log('No significant changes. Exiting.')
}
