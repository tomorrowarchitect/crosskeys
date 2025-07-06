import configHttp from './config-http.js'

export default {
    command: 'git <subcommand>',
    describe: 'Git credential related commands',
    builder: yargs =>
        yargs
            .command([configHttp])
            .demandCommand(
                1,
                'You need to specify a git-credential subcommand (config-http)'
            ),
    handler: () => {}
}
