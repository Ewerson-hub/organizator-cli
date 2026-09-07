#!/usr/bin/env node

const {program, Option} = require('commander')
const path = require('node:path')
const {resetFolders, startOrganization} = require("../src/core")
const {MODES, EXTENSIONS} = require("../src/constrants")


program.name("organizator")
.requiredOption("-s, --source <paths ...>", "informe o local de onde estão os arquivos")
.option("-d, --destination [path]", "informe o local onde os arquivos devem ficar")
.option("-r, --recursive", "Define se o organizador deve procurar e organizar arquivos contidos em subpastas.")
.option("-t, --test", "comando para fins de testes de desenvolvimento")

.addOption(new Option('-m, --mode <type>', "modos de organização")
.choices(Object.values(MODES)).default(MODES.TYPE))

.addOption(new Option('-e, --extensions <extensions...>', "filtro de extensoẽs")
.choices(Object.values(EXTENSIONS)).default(EXTENSIONS))

.action((options) => {
    
    //adicionar validacoes para casos de nao informacao do src
    const src = (options.source == '.')? process.cwd() : path.resolve(options.source);
    
    const dest = (options.destination)? path.resolve(options.destination) : src;
    
    const mode = options.mode;
    
    const ext = options.extensions;
    
    const recursive = options.recursive ?? false;

    const test = options.test ?? false
    
    
    if(!test){
        startOrganization(src, dest, mode, ext, recursive)
    }else{
        resetFolders(src)
    }
    
    
});
program.parse();

