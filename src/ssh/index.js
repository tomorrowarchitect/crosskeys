import add from './add.js'
import remove from './remove.js'
import keygen from './keygen.js'
import identity from './identity.js'
import key from './key.js'

export default {
    command: 'ssh <subcommand>',
    describe: 'SSH identity and key management commands',
    builder: yargs =>
        yargs
            .command([add, remove, keygen, identity, key])
            .demandCommand(
                1,
                'You need to specify an ssh subcommand (add, remove, rm, keygen, identity, key)'
            ),
    handler: () => {}
}
