const { MODES } = require("./constrants");
const fs = require('node:fs/promises')
const path = require("node:path")
const chalk = require('chalk');

const organizationController = async (mode, data) => {

    const auxiliarInformation = {hasMixedOrganization: true, mode: mode}

    switch (mode) {
        case MODES.TYPE:
            organizationByType(data);
            break;
        case MODES.DATE_MONTH || MODES.DATE_YEAR || MODES.DATE:
            organizationByDate(data, auxiliarInformation);
            break;
        case MODES.TYPE_DATE:
            organizationByType(data, auxiliarInformation);
            break;
        default:
            await organizationByType(data);
            break;

    }
}
async function organizationByDate(data, auxiliarInformation){
   const {src, dest, signal, files, createdDirs} = data 
   const {mode} = auxiliarInformation
   let cont = 0;

   for(const file of files){
        if(file.isFile()){

            const fileSrc = path.join(file.path, file.name)
            let fileDate = (await fs.stat(fileSrc)).mtime
            let dirNameToCreate;

            switch(mode){
                case MODES.DATE_MONTH:
                    dirNameToCreate = fileDate.toLocaleString(navigator.language, {month: 'long'})

                    if(!createdDirs.has(dirNameToCreate)){
                        await fs.mkdir(path.join(dest, dirNameToCreate), {recursive: true, signal: signal})
                        createdDirs.add(dirNameToCreate)
                    }

                    break;  
                default: 
                    break
            }

            const fileFinalDest = path.join(dest, dirNameToCreate, file.name)

            if(fileSrc != fileFinalDest){
                fs.rename(fileSrc, fileFinalDest, {signal:signal}).then( () => {
                    console.log('\n' + chalk.bold(`${file.name}`) + chalk.dim(' moved to ') + chalk.green(`${path.dirname(fileFinalDest)}`))
                    cont++
                })
            }

            if (file === files.at(-1)) {
                console.log('\n' + chalk.bold(chalk.magenta(`Operação Concluida, ${cont} itens movidos !`)))
            }
        }
   }

}

async function organizationByType(data, auxiliarInformation = { hasMixedOrganization: false, mode: null }) {
    const { src, dest, signal, files, createdDirs, extensionsWhiteList } = data

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
                if (auxiliarInformation.hasMixedOrganization) {
                    console.log('TEM MODO alem do type', auxiliarInformation.mode)
                } else {
                    await fs.rename(fileInitialSrc, fileFinalDest, { signal: signal }).then(() => {
                        cont++
                        console.log('\n' + chalk.bold(`${file.name}`) + chalk.dim(' moved to ') + chalk.green(`${path.dirname(fileFinalDest)}`))
                    })

                }


            }
        }
        if (file === files.at(-1)) {
            console.log('\n' + chalk.bold(chalk.magenta(`Operação Concluida, ${cont} itens movidos !`)))
        }
    }

}



module.exports = { organizationController }