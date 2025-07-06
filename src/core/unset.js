// crosskeys unset <profile>
import { getProfileKey } from './util.js'
import os from 'os'
import { execSync } from 'child_process'

export default {
    command: 'unset <profile>',
    describe: 'Unset credentials for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const cmd = ['security delete-generic-password', `-s "${key}"`].join(
            ' '
        )
        try {
            execSync(cmd, { stdio: 'ignore' })
            console.log('Credentials removed from macOS keychain.')
        } catch (err) {
            throw new Error(
                `Failed to remove credentials from keychain: ${err.message}`
            )
        }
    }
}
