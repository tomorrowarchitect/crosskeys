import { getPassword } from '../core/password.js'

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
            const base64Identity = getPassword(argv.profile)
            const identityContent = Buffer.from(
                base64Identity,
                'base64'
            ).toString('utf8')
            process.stdout.write(identityContent)
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
}
