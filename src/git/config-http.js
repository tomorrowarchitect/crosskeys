import { spawnSync } from 'child_process'

export default {
    command: [
        'config-http <profile> <base_url>',
        'config-https <profile> <base_url>'
    ],
    describe: 'Show git credential config for a profile and base URL',
    builder: yargs =>
        yargs
            .positional('profile', {
                describe: 'Profile name',
                type: 'string'
            })
            .positional('base_url', {
                describe: 'Base URL (e.g. https://github.com/abc/)',
                type: 'string'
            })
            .option('apply', {
                alias: 'a',
                type: 'boolean',
                describe: 'Apply the config directly using git config',
                default: false
            }),
    handler(argv) {
        const configStr = `[credential "${argv.base_url}"]
    helper = crosskeys ${argv.profile}`
        if (argv.apply) {
            const result = spawnSync(
                'git',
                [
                    'config',
                    '--global',
                    `credential.${argv.base_url}.helper`,
                    `crosskeys ${argv.profile}`
                ],
                { encoding: 'utf8' }
            )
            if (result.error) {
                console.error('Failed to apply config:', result.error.message)
            } else if (result.status !== 0) {
                console.error(
                    'Failed to apply config:',
                    result.stderr?.trim() || 'Unknown error'
                )
            } else {
                console.log('Config applied using git config.')
            }
        } else {
            console.log(`
To configure git to use this credential helper, open your global git config file (usually located at ~/.gitconfig) and add the following section:

${configStr}

Alternatively, you can run this command with the --apply flag to set it automatically.
`)
        }
    }
}
