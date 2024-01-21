
export default class Commands { 

    #tooManyArgumentsMSG = [
        {line: "Command has too many arguments", remove_spaces: true, className: "command-output-error"},
        {line: " ", remove_spaces: false, className: ""}
    ]

    #tooFewArgumentsMSG = [
        {line: "Command has too few arguments", remove_spaces: true, className: "command-output-error"},
        {line: " ", remove_spaces: false, className: ""}
    ]

    #emptyMSG = [
        {line: " ", remove_spaces: false, className: ""}
    ]

    async help(args, FS) {

        if(!args) // no arguments given when called by help command, gives easy way to add custom commands only by editing this file
            return [
                "   displays the list of commands that can be used in this terminal",
                "   help [name_of_command]",
                "      name_of_command: command to get directions on"
            ]
        
        if(args.length > 1 || args[0].length > 2)
            return this.#tooManyArgumentsMSG


        if(args[0] && args[0][1])
            if(this[args[0][1]]){
                const helpGuide = await this[args[0][1]]()
                return [...helpGuide, " "].map(line => {
                    return {line: line, remove_spaces: false, className: 'command-help'}
                })
            }

        const listOfCommands = Object.getOwnPropertyNames(Commands.prototype).filter((cmd) => cmd !== "constructor")

        let lines = await (await Promise.all(listOfCommands.map(async cmd => 
            [`command: '${cmd}'`, ...(await this[cmd]()), " "]
        ))).flat(1)

        return [" ", ...lines].map(line => {
            return {line: line, remove_spaces: false, className: 'command-help'}
        })
    }   

    async cat(args, FS) {

        if(!args)
            return [
                "   displays the contents of a file at the current path",
                "   cat file_name [-s]",
                "      file_name: name of file to get contents of",
                "      -s: open in own single page site"
            ]

        if(args.length > 2 || args[0].length > 2)
            return this.#tooManyArgumentsMSG
        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        if(args[1] && args[1][0] === "s"){

            const url = window.location.href.split('?')[0] + `?opened_file=${FS.getPath()}/${args[0][1]}`
            window.open(url)

            return [
                {line: "opening site", remove_spaces: false, className: "opening-new-site", link: url},
                ...this.#emptyMSG
            ]
        }
            

        const fileText = await FS.openFile(args[0][1])
        
        if(!fileText) return [
            {line: "File not found", remove_spaces: false, className: "command-output-error"},
            ...this.#emptyMSG
        ]
        else if(fileText[0] && fileText[0].line) return fileText

        return fileText.map((line) => {
            return {line: line, remove_spaces: false, className: "opened-file"}
        })

    }

    async ls(args, FS) {

        if(!args)
            return [
                "   displays the list of files and folders at the current path",
                "   ls"
            ]

        if(args.length > 1 || args[0].length > 1)
            return this.#tooManyArgumentsMSG
        
        let files = await FS.listAllAtPath()

        return [...files.map(f => {
            return {line: f.name, remove_spaces: false, className: f.type}
        }), ...this.#emptyMSG]

    }

    async #getFile() {

        const pickerOpts = {
            types: [
              {
                description: "",
                accept: {
                  "*/*": [".txt", ".html"],
                },
              },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
          };
        try {
            const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
            const file = await fileHandle.getFile();
            const reader = new FileReader()

            return new Promise(resolve => {
                reader.readAsText(file)
                reader.onloadend = () => {
                    resolve(reader.result)
                }
            })
        }catch(_e){
            return []
        }
        
    }

    async touch(args, FS) {

        if(!args)
            return [
                "   creates a new file at the current path",
                "   touch file_name [-f]",
                "      file_name: name of file to create",
                "      -f: specify the contents of the file from a file on a local computer"
            ]

        if(args.length > 2 || args[0].length > 2)
            return this.#tooManyArgumentsMSG

        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        let file_contents = []

        if(args[1] && args[1][0] === "f")
            file_contents = (await this.#getFile()).split('\n')
        
        FS.addFileToPath(args[0][1], file_contents)

        return this.#emptyMSG
    }

    async rm (args, FS) {

        if(!args)
            return [
                "   deletes a file/folder at the current path",
                "   rm file_name [-d] [-r]",
                "      file_name: name of file to delete",
                "      -d: delete directory with name file_name",
                "      -r: recursively delete all sub-folders and directories in file_name"
            ]

        if(args.length > 2 || args[0].length > 2)
            return this.#tooManyArgumentsMSG

        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        if(!args[1])
            FS.removeFile(args[0][1])
        else if(args[1][0] === "d")
            FS.removeFolder(args[0][1])
        else if(args[1][0] === "r")
            FS.removeFolder(args[0][1], true)

        return this.#emptyMSG

    }

    nano(args, FS, input_terminal_class) {

        if(!args)
            return [
                "   edits a file at the current path",
                "   nano file_name",
                "      file_name: name of file to edit"
            ]

        if(args.length > 1 || args[0].length > 2)
            return this.#tooManyArgumentsMSG

        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        input_terminal_class.setState({in_editor: true})

        return this.#emptyMSG
    }

    // echo(args, FS) {

    // }

    mkdir(args, FS) {

        if(!args)
            return [
                "   makes a new folder at the current path",
                "   mkdir folder_name",
                "      folder_name: name of folder to create"
            ]

        if(args.length > 1 || args[0].length > 2)
            return this.#tooManyArgumentsMSG
        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        FS.addFolderToPath(args[0][1])

        return this.#emptyMSG
    }

    cd(args, FS) {

        if(!args)
            return [
                "   adjusts current path",
                "   mkdir folder_name",
                "      folder_name: name of folder to add to current path",
            ]

        if(args.length > 1 || args[0].length > 2)
            return this.#tooManyArgumentsMSG

        if(args[0].length <= 1)
            return this.#tooFewArgumentsMSG

        FS.moveToFolder(args[0][1])

        return this.#emptyMSG
    }

}

