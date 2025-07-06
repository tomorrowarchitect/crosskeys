// crosskeys username <profile>
import { getProfileKey } from './util.js'
import os from 'os'
import { execSync } from 'child_process'

export default {
    command: 'username <profile>',
    describe: 'Get username for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const cmd = [
            'security find-generic-password',
            `-s "${key}"`,
            '-g'
        ].join(' ')
        try {
            const output = execSync(cmd, { encoding: 'utf8', stdio: 'pipe' })
            const match = output.match(/\"acct\"<blob>="([^"]+)"/)
            if (!match || !match[1]) {
                throw new Error('Username not found in keychain entry.')
            }
            console.log(match[1])
        } catch (err) {
            throw new Error(
                `Failed to retrieve username from keychain: ${err.message}`
            )
        }
    }
}
