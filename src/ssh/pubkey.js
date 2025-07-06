import { getPassword } from '../core/password.js'
import { spawnSync } from 'child_process'
import os from 'os'
import fs from 'fs'
import path from 'path'

export default {
    command: 'pubkey <profile>',
    describe: 'Show public key for a profile',
    builder: yargs =>
        yargs.positional('profile', {
            describe: 'Profile name',
            type: 'string'
        }),
    handler: argv => {
        const tmpKeyPath = path.join(
            os.tmpdir(),
            `crosskeys_tmp_${process.pid}`
        )
        let wroteFile = false
        try {
            const base64Identity = getPassword(argv.profile)
            const identityContent = Buffer.from(
                base64Identity,
                'base64'
            ).toString('utf8')
            fs.writeFileSync(tmpKeyPath, identityContent, { mode: 0o600 })
            wroteFile = true
            const result = spawnSync('ssh-keygen', ['-y', '-f', tmpKeyPath], {
                encoding: 'utf8'
            })
            if (result.error) {
                throw new Error(
                    `Failed to extract public key: ${result.error.message}`
                )
            }
            if (result.status !== 0) {
                throw new Error(
                    result.stderr?.trim() || 'Failed to extract public key.'
                )
            }
            process.stdout.write(result.stdout)
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        } finally {
            if (wroteFile && fs.existsSync(tmpKeyPath)) {
                try {
                    fs.unlinkSync(tmpKeyPath)
                } catch (_) {}
            }
        }
    }
}
