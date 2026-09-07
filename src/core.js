const { organizationController} = require('./controller.js')
const fs = require('node:fs/promises')
const path = require("node:path")
const controller = new AbortController();
const chalk = require('chalk');

module.exports = {
    resetFolders: async (src) => {
        const files = await fs.readdir(src, { withFileTypes: true, recursive: true })

        if (!files.length) {
            console.log(chalk.yellow('A pasta não contem arquivos para organizar'))
            return
        }

        const emptyFolders = new Set();

        for (const file of files) {
            if (file.isFile()) {
                emptyFolders.add(file.parentPath)
                await fs.rename(path.join(file.parentPath, file.name), path.join(src, file.name))
                console.log('\n' + chalk.bold(`${file.name}`) + chalk.dim(' moved to ') + chalk.green(`${path.dirname(path.join(file.parentPath, file.name))}`))
            }

        }

        emptyFolders.forEach(path => {
            fs.rmdir(path)
        })

        console.log(emptyFolders)

    },

    startOrganization: async (src, dest, mode, ext, recursive) => {

        process.on('SIGINT', () => {
            console.log('\n' + chalk.red('Operação cancelada !'))
            controller.abort();
        })

        try {
            const signal = controller.signal;
            const readdirOptions = (!recursive) ? { withFileTypes: true, signal: signal } : { withFileTypes: true, recursive: true, signal: signal };

            const files = await fs.readdir(src, readdirOptions)

            if (!files.length) {
                console.log(chalk.yellow('A pasta não contem arquivos para organizar'))
                return
            }

            //cache    
            const createdDirs = new Set();
            const extensionsWhiteList = new Set(ext);

            organizationController(mode, {src, dest, signal, files, createdDirs, extensionsWhiteList})
        } catch (err) {
            console.log(chalk.red(`Erro na execução -> ${err.message}`))
        }
    }
}