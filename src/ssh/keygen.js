import { setCredentials } from '../core/set.js'
import { spawnSync } from 'child_process'
import os from 'os'
import fs from 'fs'
import path from 'path'

export default {
    command: 'keygen <profile>',
    describe: 'Generate a new SSH key for a profile',
    builder: yargs =>
        yargs
            .positional('profile', {
                describe: 'Profile name',
                type: 'string'
            })
            .option('t', {
                alias: 'type',
                describe: 'Type of key to create (passed to ssh-keygen -t)',
                type: 'string',
                demandOption: false
            }),
    handler: argv => {
        const username =
            process.env.USER || process.env.LOGNAME || os.userInfo().username
        const tmpKeyPath = path.join(
            os.tmpdir(),
            `crosskeys_key_${process.pid}`
        )
        const tmpPubPath = `${tmpKeyPath}.pub`
        try {
            // Build ssh-keygen args
            const args = []
            if (argv.t) {
                args.push('-t', argv.t)
            }
            args.push('-N', '')
            args.push('-C', argv.profile)
            args.push('-f', tmpKeyPath)

            const result = spawnSync('ssh-keygen', args, {
                encoding: 'utf8',
                stdio: 'ignore'
            })
            if (result.error)
                throw new Error(
                    `Failed to generate SSH key: ${result.error.message}`
                )
            if (result.status !== 0)
                throw new Error('Failed to generate SSH key.')

            const identityContent = fs.readFileSync(tmpKeyPath, 'utf8')
            const base64Identity = Buffer.from(
                identityContent,
                'utf8'
            ).toString('base64')
            setCredentials(argv.profile, username, base64Identity)
            console.log(
                `New SSH key for profile "${argv.profile}" added to keychain.`
            )
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        } finally {
            try {
                fs.existsSync(tmpKeyPath) && fs.unlinkSync(tmpKeyPath)
            } catch (_) {}
            try {
                fs.existsSync(tmpPubPath) && fs.unlinkSync(tmpPubPath)
            } catch (_) {}
        }
    }
}
