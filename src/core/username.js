// crosskeys username <profile>
import { getProfileKey } from './util.js'
import os from 'os'
import { spawnSync } from 'child_process'

export default {
    command: 'username <profile>',
    describe: 'Get username for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const args = ['find-generic-password', '-s', key, '-g']
        const result = spawnSync('security', args, { encoding: 'utf8' })
        if (result.error) {
            throw new Error(
                `Failed to retrieve username from keychain: ${result.error.message}`
            )
        }
        if (result.status !== 0) {
            throw new Error(
                `Failed to retrieve username from keychain: ${result.stderr?.trim() || 'Unknown error'}`
            )
        }
        const output = result.stdout
        const match = output.match(/"acct"<blob>="([^"]+)"/)
        if (!match || !match[1]) {
            throw new Error('Username not found in keychain entry.')
        }
        console.log(match[1])
    }
}
