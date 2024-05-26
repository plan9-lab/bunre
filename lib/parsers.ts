
export function parseCommit(str: string) {
    const pattern = /(?<commit>[0-9a-z]+) (?<type>feat|fix|chore|docs|test|refactor|perf|build|ci|revert|style|types|workflow|release)(?<scope>([^:]+))?:[ ]+(?<subject>.*)$/;
    const match = str.match(pattern);
    if (!match) {
        return null;
    }

    return match.groups;
}
