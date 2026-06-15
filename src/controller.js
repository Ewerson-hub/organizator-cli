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
        case MODES.DATE_MONTH:
            organizationByType(data, auxiliarInformation);
            break;
        case MODES.DATE_YEAR:
            organizationByType(data, auxiliarInformation);
            break;
        case MODES.TYPE_DATE:
            organizationByType(data, auxiliarInformation);
            break;
        default:
            await organizationByType(data);
            break;

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