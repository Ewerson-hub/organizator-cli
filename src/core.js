const {organizationController} = require('./controller.js')
const fs = require('node:fs/promises')
const controller = new AbortController();
const chalk = require('chalk');

module.exports = {
    printHello: (array) => {
        //função simples para testar qualquer coisa que eu quiser.
        console.log('os.platform()')
    },

    startOrganization: async (src, dest, mode, ext, recursive) => {

        process.on('SIGINT', () => {
            console.log('\n'+chalk.red('Operação cancelada !'))
            controller.abort();
        })

        try {
            const signal = controller.signal;
            const readdirOptions = (!recursive) ? { withFileTypes: true, signal: signal } : { withFileTypes: true, recursive: true, signal: signal };
            
            const files = await fs.readdir(src, readdirOptions)
        
            if (!files.length){
                console.log(chalk.yellow('A pasta não contem arquivos para organizar'))
                return
            } 
            
            //cache    
            const createdDirs = new Set();
            const extensionsWhiteList = new Set(ext);


            organizationController(mode, {src: src, dest: dest, signal:signal, files:files, createdDirs: createdDirs, extensionsWhiteList: extensionsWhiteList})

        } catch (err) {
            console.log(chalk.red(`Erro na execução -> ${err.message}`))
        }
    }
}