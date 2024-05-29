export type ParsedCommit = {
    type: string,
    scope: string,
    subject: string,
    message: string,
}

// Parses conventional commits from string
// Example input: feat(parsers): add parseCommit function
// Example output: { type: 'feat', scope: 'parsers', subject: 'add parseCommit function', message: 'feat(parsers): add parseCommit function' }
export function parseCommit(str: string): ParsedCommit | null {
    str = str
        .trim()
        .replace(/\s+/g, ' ')
    const pattern = /(?<commit>[0-9a-z]+) (?<type>feat|fix|chore|docs|test|refactor|perf|build|ci|revert|style|types|workflow|release)(?<scope>([^:]+))?:[ ]+(?<subject>.*)/i;
    const match = str.match(pattern);
    if (!match) {
        return null;
    }

    match.groups?.type && (match.groups.type = match.groups.type.toLowerCase())
    match.groups?.scope && (
        match.groups.scope = match.groups.scope
            .toLowerCase()
            .replace('(', '').replace(')', '')
    )

    return { ...match.groups, message: str }
}

// Parses semver(major.minor.patch) from string
// Example input: 1.0.0
// Example output: { major: 1, minor: 0, patch: 0 }
export function parseSemver(str: string) {
    const [
        major,
        minor,
        patch,
    ] = str.split('.')

    return {
        major: parseInt(major),
        minor: parseInt(minor),
        patch: parseInt(patch),
    }
}
