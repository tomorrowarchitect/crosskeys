import { setCredentials } from '../core/set.js'
import fs from 'fs'
import os from 'os'

export default {
    command: 'add <profile> <sshIdentityFile>',
    describe: 'Add an SSH identity file for a profile',
    builder: yargs =>
        yargs
            .positional('profile', {
                describe: 'Profile name',
                type: 'string'
            })
            .positional('sshIdentityFile', {
                describe: 'Path to SSH identity file',
                type: 'string'
            }),
    handler: ({ profile, sshIdentityFile }) => {
        const username =
            process.env.USER || process.env.LOGNAME || os.userInfo().username
        let identityContent
        try {
            identityContent = fs.readFileSync(sshIdentityFile, 'utf8')
        } catch (err) {
            throw new Error(`Failed to read SSH identity file: ${err.message}`)
        }
        const base64Identity = Buffer.from(identityContent, 'utf8').toString(
            'base64'
        )
        setCredentials(profile, username, base64Identity)
        console.log(`SSH identity for profile "${profile}" added to keychain.`)
    }
}
