#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import core from './core/index.js'
import git from './git/index.js'
import ssh from './ssh/index.js'

const cli = yargs(hideBin(process.argv))
    .parserConfiguration({ 'halt-at-non-option': false, 'populate--': true })
    .scriptName('crosskeys')
    .usage('$0 <cmd> [args]')

cli.command(core)
cli.command([git, ssh])

cli.demandCommand(1, 'You need at least one command before moving on')
    .help()
    .strictCommands()
    .parse()
