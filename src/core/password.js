// crosskeys password <profile>
import { getProfileKey } from './util.js'
import os from 'os'
import { spawnSync } from 'child_process'

export function getPassword(profile) {
    if (os.platform() !== 'darwin') {
        throw new Error('This command is only supported on macOS.')
    }
    const key = getProfileKey(profile)
    const args = ['find-generic-password', '-s', key, '-w']
    const result = spawnSync('security', args, { encoding: 'utf8' })

    if (result.error) {
        throw new Error(
            `Failed to retrieve password from keychain: ${result.error.message}`
        )
    }
    if (result.status !== 0) {
        throw new Error(
            `Failed to retrieve password from keychain: ${result.stderr?.trim() || 'Unknown error'}`
        )
    }

    const password = result.stdout.trim()
    if (!password) {
        throw new Error('Password not found in keychain entry.')
    }
    return password
}

export default {
    command: 'password <profile>',
    describe: 'Get password for a profile',
    handler(argv) {
        try {
            console.log(getPassword(argv.profile))
        } catch (err) {
            console.error(err.message)
            process.exit(1)
        }
    }
}
