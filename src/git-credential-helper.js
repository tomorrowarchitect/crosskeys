#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { getUsername } from './core/username.js'
import { getPassword } from './core/password.js'

const argv = yargs(hideBin(process.argv)).parse()

function outputCredentials(profile) {
    try {
        const username = getUsername(profile)
        const password = getPassword(profile)
        console.log(`username=${username}`)
        console.log(`password=${password}`)
    } catch {
        // Silent on error as per requirements
    }
}

if (argv._[1] === 'get' && argv._[0]) {
    outputCredentials(argv._[0])
}
