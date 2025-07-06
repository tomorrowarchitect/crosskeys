export default {
    command: 'keygen <profile>',
    describe: 'Generate a new SSH key for a profile',
    builder: yargs =>
        yargs.positional('profile', {
            describe: 'Profile name',
            type: 'string'
        }),
    handler: argv => {
        // TODO: Implement logic to generate SSH key for the profile
        throw new Error('Not implemented')
    }
}
