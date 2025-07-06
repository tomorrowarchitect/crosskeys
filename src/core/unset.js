// crosskeys unset <profile>

import { getProfileKey } from './util.js'
import os from 'os'
import { spawnSync } from 'child_process'

export function unsetCredentials(profile) {
    if (os.platform() !== 'darwin') {
        throw new Error('This command is only supported on macOS.')
    }
    const key = getProfileKey(profile)
    const args = ['delete-generic-password', '-s', key]
    const result = spawnSync('security', args, {
        stdio: 'ignore',
        encoding: 'utf8'
    })
    if (result.error) {
        throw new Error(
            `Failed to remove credentials from keychain: ${result.error.message}`
        )
    }
    if (result.status !== 0) {
        throw new Error('Failed to remove credentials from keychain.')
    }
}

export default {
    command: 'unset <profile>',
    describe: 'Unset credentials for a profile',
    handler(argv) {
        unsetCredentials(argv.profile)
        console.log('Credentials removed from macOS keychain.')
    }
}
