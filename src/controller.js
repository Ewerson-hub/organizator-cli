const { MODES } = require("./constrants");
const fs = require('node:fs/promises')
const path = require("node:path")
const chalk = require('chalk');

const organizationController = async (mode, data) => {
    const { src, dest, signal, files, createdDirs, extensionsWhiteList } = data

    let cont = 0;
    for (const file of files) {
        if (file.isFile()) {
            const fileInitialSrc = path.join(file.parentPath, file.name);

            let newDir;

            if (mode === MODES.TYPE) {
                newDir = await separeByType({ fileInitialSrc, dest, signal, createdDirs, extensionsWhiteList })
            } else if (mode === MODES.TYPE_DATE) {
                newDir = ""
            } else {
                const createdMonths = new Set();
                newDir = await separeByDate({ fileInitialSrc, dest, signal, createdDirs, createdMonths, mode })
            }

            if (newDir) {
                console.log(newDir)
                const fileFinalDest = path.join(dest, newDir, file.name)

                if (fileInitialSrc !== fileFinalDest) {
                    await fs.rename(fileInitialSrc, fileFinalDest, { signal: signal }).then(() => {
                        cont++
                        console.log('\n' + chalk.bold(`${file.name}`) + chalk.dim(' moved to ') + chalk.green(`${path.dirname(fileFinalDest)}`))
                    })
                }
            }
            if (file === files.at(-1)) {
                console.log('\n' + chalk.bold(chalk.magenta(`Operação Concluida, ${cont} itens movidos !`)))
            }

        }

    }

}
const separeByDate = async (data) => {
    //date has 3 options: date (year + month), only year and only month
    const { fileInitialSrc, dest, signal, createdDirs, createdMonths, mode } = data

    let fileDate = (await fs.stat(fileInitialSrc)).mtime
    let dirNameToCreate;

    if (mode === MODES.DATE_MONTH) {
        dirNameToCreate = fileDate.toLocaleString(navigator.language, { month: 'long' })
    } else if (mode === MODES.DATE_MONTH) {
        dirNameToCreate = fileDate.toLocaleString(navigator.language, { year: "numeric" })
    } else {
        const year = fileDate.toLocaleString(navigator.language, { year: "numeric" });
        const month = fileDate.toLocaleString(navigator.language, { month: 'long' });

        if (!createdDirs.has(year)) {
            await fs.mkdir(path.join(dest, year), { recursive: true, signal: signal })
            createdDirs.add(year)
        }
        if (!createdMonths.has(`${year}/${month}`)) {
            await fs.mkdir(path.join(dest, year, month), { recursive: true, signal: signal })
            createdMonths.add(`${year}/${month}`)
        }

        dirNameToCreate = path.join(year, month)
    }
    return dirNameToCreate
}
const separeByType = async (data) => {
    const { fileInitialSrc, dest, signal, createdDirs, extensionsWhiteList } = data

    const extensionName = path.extname(fileInitialSrc).slice(1);

    if (extensionsWhiteList.has(extensionName)) {
        //checa se o diretorio ja existe, se não -> cria ele 
        if (!createdDirs.has(extensionName)) {
            await fs.mkdir(path.join(dest, extensionName), { recursive: true, signal: signal })
            createdDirs.add(extensionName)
        }
        return extensionName
    }
    return false
}



module.exports = { organizationController}