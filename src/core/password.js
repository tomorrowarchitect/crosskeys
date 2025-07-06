// crosskeys password <profile>
import { getProfileKey } from './util.js'
import os from 'os'
import { execSync } from 'child_process'

export default {
    command: 'password <profile>',
    describe: 'Get password for a profile',
    handler(argv) {
        if (os.platform() !== 'darwin') {
            throw new Error('This command is only supported on macOS.')
        }
        const key = getProfileKey(argv.profile)
        const cmd = [
            'security find-generic-password',
            `-s "${key}"`,
            '-w'
        ].join(' ')
        try {
            const password = execSync(cmd, {
                encoding: 'utf8',
                stdio: 'pipe'
            }).trim()
            if (!password) {
                throw new Error('Password not found in keychain entry.')
            }
            console.log(password)
        } catch (err) {
            throw new Error(
                `Failed to retrieve password from keychain: ${err.message}`
            )
        }
    }
}
