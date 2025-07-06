// crosskeys set <profile> <username> <password>

import { getProfileKey } from './util.js'
import os from 'os'
import { execSync } from 'child_process'

export default {
    command: 'set <profile> <username> <password>',
    describe: 'Set credentials for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const cmd = [
            'security add-generic-password',
            `-a "${argv.username}"`,
            `-s "${key}"`,
            `-w "${argv.password}"`,
            '-U'
        ].join(' ')
        try {
            execSync(cmd, { stdio: 'ignore' })
            console.log('Credentials saved to macOS keychain.')
        } catch (err) {
            throw new Error(
                `Failed to save credentials to keychain: ${err.message}`
            )
        }
    }
}
