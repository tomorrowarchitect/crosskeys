import { getPassword } from '../core/password.js'

export function getIdentity(profile) {
    return Buffer.from(getPassword(profile), 'base64').toString('utf8')
}

export default {
    command: 'identity <profile>',
    describe: 'Show SSH identity file for a profile',
    builder: yargs =>
        yargs.positional('profile', {
            describe: 'Profile name',
            type: 'string'
        }),
    handler: argv => {
        try {
            process.stdout.write(getIdentity(argv.profile))
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
}
