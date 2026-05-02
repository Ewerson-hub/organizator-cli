#!/usr/bin/env node

const {program, Option} = require('commander')
const path = require('node:path')
const {printHello, startOrganization} = require("../src/core")
const {MODES, EXTENSIONS} = require("../src/constrants")


program.name("organizator")
.requiredOption("-s, --source <paths ...>", "informe o local de onde estão os arquivos")
.option("-d, --destination [path]", "informe o local onde os arquivos devem ficar")
.option("-r, --recursive", "Define se o organizador deve procurar e organizar arquivos contidos em subpastas.")
.addOption(new Option('-m, --mode <type>', "modos de organização")
.choices(Object.values(MODES)).default(MODES.TYPE))
.addOption(new Option('-e, --extensions <extensions...>', "filtro de extensoẽs")
.choices(Object.values(EXTENSIONS)).default(EXTENSIONS))
.action((options) => {

    const src = (options.src === '.')? process.cwd() : path.resolve(options.src)
    const dest = (options.dest)? path.resolve(options.dest) : src;
    const mode = options.mode;
    const ext = options.ext
    const recursive = options.recursive

    console.log(src)
    // printHello([src, dest, mode, ext])
    // startOrganization(src, dest, mode, ext, recursive)
    
});
program.parse();

