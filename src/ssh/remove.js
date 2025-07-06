import { unsetCredentials } from '../core/unset.js'

export default {
    command: ['remove <profile>', 'rm <profile>'],
    describe: 'Remove SSH identity for a profile',
    builder: yargs =>
        yargs.positional('profile', {
            describe: 'Profile name',
            type: 'string'
        }),
    handler: argv => {
        unsetCredentials(argv.profile)
        console.log(
            `SSH identity for profile "${argv.profile}" removed from keychain.`
        )
    }
}
