# Organizator CLI
A Simple and fast cli for organizer all itens you want. ( UNDER DEVELOPMENT !)

## Starting
To install and run this CLI, you need have node and npm installed on your machine, currently I use this versions :

    node v22.14.0
    npm v10.9.2

### Instalation
First clone this repositorie, open terminal in the clone folder and run this command for install all project dependencies:

    npm install

Next, create a simbolical link to running the CLI wherever you want :
    
    npm link organizer

### About the CLI
Flags explanations:

    This tool have a 6 flags

    1° (-s or --source)[path]-> this parameter is required; it define the location of the disorganized files, as a shortcut you can user a '.' for use a currently path as the source (ex: -s . ) .

    2° (-d or --destination)[path] ->  this parameter is optional; it define the location where the organized files should be stored; if it is not specified, the destination will be the same reading folder (--source). 

    3° (-r or --recursive)[boolean] -> this parameter is optional, it define if the organizator must searching and organizing itens contained in subfolders; by default, the value is disabled.

    4° (-m or --mode)[string] {IN PROGRESS} -> This parameter is optional and is still under development, it define the desired organization method; by default, the value is a organization by type.

    5° (-e or --extensions)[array] -> this parameter is optional, it define desired file extensions for the organization, by default its value is ["pdf","epub","mobi","txt","jpg","jpeg","mp3","mp4","docx"]

    6° (-h or --help) -> this parameter is optional, It displays all the flags and indicates what each one does.
    
### How to use
After the installation process, you can combine all the flags you want :

    //Simple organizaltion, with source and destination being the currently path, recursive mode disabled, organization mode by type, and defaults extensions:

    organizator -s . 

    //More specific organization, with differences between origin and destination, recursive mode enabled and search only for 'pdf' extensions :

    organizator -s '/home/user/download' -d '/home/user/documents' -r -e 'pdf'
