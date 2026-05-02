const fs = require('node:fs/promises')
const path = require("node:path")
const controller = new AbortController();

async function organizationByType(src, dest, ext, recursive, signal) {
    try {
        const readdirOptions = (!recursive) ? { withFileTypes: true, signal: signal } : { withFileTypes: true, recursive: true, signal: signal };

        const files = await fs.readdir(src, readdirOptions)

        if (files.length === 0) console.log('Erro ! A pasta não contem arquivos para organizar')

        //cache    
        const createdDirs = new Set();
        const extensionsWhiteList = new Set(ext);
        
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
                        console.log(`Moved ${file.name} --> ${fileFinalDest}`)
                    })
                }

            }

        }

    } catch (err) {
        console.log('erro no try : ', err)
    }

}

module.exports = {
    printHello: (array) => {
        //função simples para testar qualquer coisa que eu quiser.
        console.log(os.platform())
    },

    startOrganization: (src, dest, mode, ext, recursive) => {

        process.on('SIGINT', () => {
            console.log('Cancelando escrita')
            controller.abort();
        })

        organizationByType(src, dest, ext, recursive, controller.signal)
    }
}