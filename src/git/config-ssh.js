import { spawnSync } from 'child_process'

export default {
    command: ['config-ssh <profile> <base_ssh_path>'],
    describe: 'Show git credential config for a profile and base URL',
    builder: yargs =>
        yargs
            .positional('profile', {
                describe: 'Profile name',
                type: 'string'
            })
            .positional('base_ssh_path', {
                describe: 'Base SSH path (e.g. git@github.com:abc/)',
                type: 'string'
            })
            .option('apply', {
                alias: 'a',
                type: 'boolean',
                describe: 'Apply the config directly using git config',
                default: false
            }),
    handler(argv) {
        // Parse base_ssh_path: e.g. git@github.com:midnightideas/
        const match = String(argv.base_ssh_path).match(
            /^(?<user>[^@]+)@(?<host>[^:]+):(?<path>.+)$/
        )
        let sshUser = 'git',
            sshHost = 'github.com',
            sshPath = '/'
        if (match && match.groups) {
            sshUser = match.groups.user
            sshHost = match.groups.host
            sshPath = match.groups.path
        }

        if (argv.apply) {
            const result = spawnSync(
                'git',
                [
                    'config',
                    '--global',
                    `credential.${argv.base_ssh_path}.helper`,
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
To configure git and ssh for this profile, add the following to your configuration files:

In your ~/.gitconfig:

[url "${sshUser}@${argv.profile}.crosskeys:${sshPath}"]
    insteadOf = ${argv.base_ssh_path}

In your ~/.ssh/config:

Host ${argv.profile}.crosskeys
    HostName ${sshHost}
    User ${sshUser}
    IdentityFile ~/.crosskeys/identities/${argv.profile}
    IdentitiesOnly yes
    ProxyCommand ssh-exec-crosskeys %h %p ${argv.profile}

Alternatively, you can run this command with the --apply flag to set the credential helper automatically.
`)
        }
    }
}
