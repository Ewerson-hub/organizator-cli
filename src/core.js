const fs = require('node:fs/promises')
const path = require("node:path")
const controller = new AbortController();
const chalk = require('chalk');

async function organizationByType(src, dest, signal, files, createdDirs, extensionsWhiteList) {
    let cont = 0;
    for (const file of files) {

        const fileInitialSrc = path.join(file.path, file.name);

        //pega extensao do arquivo sem o ponto
        const extensionName = path.extname(fileInitialSrc).slice(1);

        //checa se a extensão esta na lista de arquivos desejado
        if (extensionsWhiteList.has(extensionName)) {

            //checa se o diretorio ja existe, se não -> cria ele 
            if (!createdDirs.has(extensionName)) {
                await fs.mkdir(path.join(src, extensionName), { recursive: true, signal: signal })
                createdDirs.add(extensionName)
            }


            const fileFinalDest = path.join(dest, extensionName, file.name)

            if (fileInitialSrc != fileFinalDest) {
                await fs.rename(fileInitialSrc, fileFinalDest, { signal: signal }).then(() => {
                    cont++
                    console.log('\n'+chalk.bold(`${file.name}`) + chalk.dim(' moved to ') + chalk.green(`${path.dirname(fileFinalDest)}`))
                })
            }
        }
        if(file === files.at(-1)){
            console.log('\n'+ chalk.magenta(`Operação Concluida, ${cont} itens movidos !`))
        }
    }

}

module.exports = {
    printHello: (array) => {
        //função simples para testar qualquer coisa que eu quiser.
        console.log(os.platform())
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

            organizationByType(src, dest, signal, files, createdDirs, extensionsWhiteList)

        } catch (err) {
            console.log(chalk.red(`Erro na execução -> ${err.message}`))
        }
    }
}