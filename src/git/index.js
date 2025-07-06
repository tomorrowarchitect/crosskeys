import configHttp from './config-http.js'
import configSsh from './config-ssh.js'

export default {
    command: 'git <subcommand>',
    describe: 'Git credential related commands',
    builder: yargs =>
        yargs
            .command([configHttp, configSsh])
            .demandCommand(
                1,
                'You need to specify a git-credential subcommand (config-http or config-ssh)'
            ),
    handler: () => {}
}
