abstract class GitWrapper {
    // async method to fetch git status in a machine readable format
    static async status() {
        return Bun.$`git status --short`.text()
    }

    // async method to show git log in a machine readable format
    static async log() {
        return Bun.$`git log origin..HEAD --oneline`.text()
    }
}

const gitStatusOutput = await GitWrapper.status()
const gitLogOnelineOutput = await GitWrapper.log()

console.log(gitStatusOutput)
console.log(gitLogOnelineOutput)