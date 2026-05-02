const fs = require('node:fs/promises')
const path = require("node:path")


module.exports = {
    printHello: (array) => {
        //função simples para testar qualquer coisa que eu quiser.
        console.log(os.platform())
    },

    startOrganization: async (src, dest, mode, ext, recursive) => { 
        try{
            const files = (!recursive)? await fs.readdir(src, {withFileTypes: true}): await fs.readdir(src, {withFileTypes: true, recursive: true});  

            if(files.length === 0) console.log('Erro ! A pasta não contem arquivos para organizar')

            const createdDirs = new Set();
            const extensionsWhiteList = new Set(ext);
            

            for (const file of files) {
                
                const fileInitialSrc = path.join(file.path, file.name);

                //pega extensao do arquivo sem o ponto
                const extensionName = path.extname(fileInitialSrc).slice(1);
 
                //checa se a extensão esta na lista de arquivos desejado
                if(extensionsWhiteList.has(extensionName)){
                    
                    //checa se o diretorio ja existe, se não -> cria ele 
                    if(!createdDirs.has(extensionName)){
                        await fs.mkdir(path.join(src, extensionName), {recursive:true})
                        createdDirs.add(extensionName)
                    }

  
                    const fileFinalDest = path.join(dest, extensionName,file.name)

                    if( fileInitialSrc != fileFinalDest){
                         await fs.rename(fileInitialSrc, fileFinalDest).then(() => {
                            console.log(`Moved ${file.name} --> ${fileFinalDest}`)
                        })
                    }
                              
                }


            }

        }catch(err){
            console.log('erro no try : ',err)
        }

    }
}