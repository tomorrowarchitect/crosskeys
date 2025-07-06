import os from 'os'
import { spawnSync } from 'child_process'
import { getProfileKey } from './util.js'
import { unsetCredentials } from './unset.js'

export function setCredentials(profile, username, password) {
    if (os.platform() !== 'darwin') {
        throw new Error('This command is only supported on macOS.')
    }
    const key = getProfileKey(profile)

    // Remove any existing entry for this service/account, ignore error if not found
    try {
        unsetCredentials(profile)
    } catch (_) {}

    const args = [
        'add-generic-password',
        '-a',
        username,
        '-s',
        key,
        '-w',
        password,
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
        throw new Error('Failed to save credentials to keychain.')
    }
}

export default {
    command: 'set <profile> <username> <password>',
    describe: 'Set credentials for a profile',
    handler(argv) {
        setCredentials(argv.profile, argv.username, argv.password)
        console.log('Credentials saved to macOS keychain.')
    }
}
