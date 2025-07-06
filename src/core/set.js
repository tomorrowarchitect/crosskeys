// crosskeys set <profile> <username> <password>

import { getProfileKey } from './util.js'
import os from 'os'
import { spawnSync } from 'child_process'

export default {
    command: 'set <profile> <username> <password>',
    describe: 'Set credentials for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const args = [
            'add-generic-password',
            '-a',
            argv.username,
            '-s',
            key,
            '-w',
            argv.password,
            '-U'
        ]
        const result = spawnSync('security', args, {
            stdio: 'ignore',
            encoding: 'utf8'
        })
        if (result.error) {
            throw new Error(
                `Failed to save credentials to keychain: ${result.error.message}`
            )
        }
        if (result.status !== 0) {
            throw new Error(`Failed to save credentials to keychain.`)
        }
        console.log('Credentials saved to macOS keychain.')
    }
}
