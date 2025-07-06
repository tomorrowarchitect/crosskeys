import { spawnSync } from 'child_process'
import fs from 'fs'

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
            // --- GIT CONFIG ---
            // Set git insteadOf url
            const urlSection = `${sshUser}@${argv.profile}.crosskeys:${sshPath}`
            const gitUrlResult = spawnSync(
                'git',
                [
                    'config',
                    '--global',
                    `url.${urlSection}.insteadOf`,
                    argv.base_ssh_path
                ],
                { encoding: 'utf8' }
            )
            if (gitUrlResult.error || gitUrlResult.status !== 0) {
                const msg = gitUrlResult.error
                    ? gitUrlResult.error.message
                    : gitUrlResult.stderr?.trim() || 'Unknown error'
                console.error('Failed to apply git insteadOf config:', msg)
            } else {
                console.log('Git insteadOf URL config applied.')
            }

            // --- SSH CONFIG ---
            const sshConfigPath = `${process.env.HOME}/.ssh/config`
            const sshConfigEntry = `
Host ${argv.profile}.crosskeys
    HostName ${sshHost}
    User ${sshUser}
    IdentityFile ~/.crosskeys/identities/${argv.profile}
    IdentitiesOnly yes
    ProxyCommand ssh-exec-crosskeys %h %p ${argv.profile}
`
            let sshConfigContent = ''
            try {
                if (fs.existsSync(sshConfigPath)) {
                    sshConfigContent = fs.readFileSync(sshConfigPath, 'utf8')
                }
            } catch (e) {
                console.error('Failed to read SSH config:', e.message)
            }
            // Remove any existing Host section for this profile before appending
            const hostPattern = new RegExp(
                `(^|\\n)Host ${argv.profile}\\.crosskeys[\\s\\S]*?(?=\\nHost |$)`,
                'g'
            )
            if (sshConfigContent.match(hostPattern)) {
                try {
                    sshConfigContent = sshConfigContent.replace(hostPattern, '')
                    fs.writeFileSync(sshConfigPath, sshConfigContent, 'utf8')
                    console.log('Old SSH config entry removed.')
                } catch (e) {
                    console.error(
                        'Failed to remove old SSH config entry:',
                        e.message
                    )
                }
            }
            try {
                fs.appendFileSync(sshConfigPath, `\n${sshConfigEntry}`)
                console.log('SSH config entry added.')
            } catch (e) {
                console.error('Failed to update SSH config:', e.message)
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
