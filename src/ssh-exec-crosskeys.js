#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import net from 'net'
import os from 'os'
import fs from 'fs'
import { getIdentity } from './ssh/identity.js'

const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <profile>')
    .demandCommand(1, 'Profile is required')
    .strict()
    .help(false)
    .version(false)
    .parse()

function ensureIdentityFile(profile, identity) {
    const identitiesDir = `${os.homedir()}/.crosskeys/identities`
    fs.mkdirSync(identitiesDir, { recursive: true, mode: 0o700 })
    const identityPath = `${identitiesDir}/${profile}`
    fs.writeFileSync(identityPath, identity, { mode: 0o600 })
    return identityPath
}

function cleanupIdentityFile(identityPath) {
    if (!identityPath) return
    try {
        fs.unlinkSync(identityPath)
        console.error(`Cleaned up identity file: ${identityPath}`)
    } catch (e) {
        if (e.code !== 'ENOENT') {
            console.error(
                `Error cleaning up identity file ${identityPath}: ${e.message}`
            )
        }
    }
}

function cleanupAndExit(identityPath, code) {
    cleanupIdentityFile(identityPath)
    process.exit(code)
}

function proxyCommand(host, port, profile) {
    const identity = getIdentity(profile)
    const identityPath = ensureIdentityFile(profile, identity)

    // Register signal handlers for robust cleanup
    for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
        process.on(signal, () => cleanupAndExit(identityPath, 0))
    }

    const socket = net.connect(port, host, () => {
        process.stdin.pipe(socket)
        socket.pipe(process.stdout)
    })

    socket.on('error', err => {
        console.error(`Socket error: ${err.message}`)
        cleanupAndExit(identityPath, 1)
    })
    socket.on('close', () => {
        console.error('Socket closed.')
        cleanupAndExit(identityPath, 0)
    })

    // Ensure socket closes if stdin ends
    process.stdin.on('end', () => socket.end())
}

function main() {
    const [host, port, profile] = argv._.map(String)
    if (!host || !port || !profile) process.exit(1)
    proxyCommand(host, port, profile)
}

main()
