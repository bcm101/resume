import init from './init.json' // init is the initial state of the file system on first load
import builtIn from './built_in.json' // builtIn are the built in files that are not stored locally

export default class FileSystem {
    
    #current_path = ['~'] // current path of the client

    // for the storage of files
    #storeKeyFiles = ""
    #storeNameFiles = "" 

    // for the locations of files
    #storeNamePaths = ""
    #storeKeyPaths = ""

    constructor(doneLoading = () => {}){
        this.#storeNameFiles = 'localFiles'; 
        this.#storeKeyFiles = 'file';

        this.#storeNamePaths = "paths" 
        this.#storeKeyPaths = "path"

        const dbVersion = 1;
        const stores = [
            {keyPath: this.#storeKeyFiles, name: this.#storeNameFiles},
            {keyPath: this.#storeKeyPaths, name: this.#storeNamePaths}
        ]

        let database = null;
        let needsINIT = false;

        const initIndexedDb = (dbName, stores) => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(dbName, dbVersion);
                request.onerror = (event) => {
                    reject(event.target.error);
                };
                request.onsuccess = (event) => {
                    resolve(event.target.result);
                };
                request.onupgradeneeded = (event) => {
                    stores.forEach((store) => {
                        const objectStore = event.target.result.createObjectStore(store.name, {
                            keyPath: store.keyPath,
                        });
                        objectStore.createIndex(store.keyPath, store.keyPath, { unique: true });
                    });
                    needsINIT = true;
                };
            });
        };

        const accessGenerator = (storeName, db) => {
            return async (storeKey, callback = () => {}) => {

                return new Promise((resolve, reject) => {
                    const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(storeKey)
                    request.onsuccess = (event) => {
                        callback(event.target.result?.data)
                        resolve(event.target.result?.data)
                    }
                    request.onerror = () => {reject()}
                })

            }
        }

        const addGenerator = (storeName, storeKey, db) => {
            return async (addKey, value, callback = () => {}) => {
                

                return new Promise((resolve, _reject) => {
                    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
                    store.transaction.oncomplete = () => {
                        callback()
                        resolve()
                    }

                    let to_add = {}
                    to_add[storeKey] = addKey
                    to_add["data"] = value

                    store.add(to_add)
                })

            }
        }

        const deleteGenerator = (storeName, db) => {
            return async (storeKey, callback = () => {}) => {
                return new Promise((resolve, _reject) => {
                    const store = db.transaction(storeName, 'readwrite').objectStore(storeName)
                    store.transaction.oncomplete = () => {
                        callback()
                        resolve()
                    }
                    store.delete(storeKey)
                })
            }
        }

        window.addEventListener('load', async () => {
            database = await initIndexedDb('file-system', stores);

            // set functions from generators !
            this.accessFile = accessGenerator(this.#storeNameFiles, database)
            this.accessPath = accessGenerator(this.#storeNamePaths, database)
            this.deleteFile = deleteGenerator(this.#storeNameFiles, database)
            this.deletePath = deleteGenerator(this.#storeNamePaths, database)
            this.addFile = addGenerator(this.#storeNameFiles, this.#storeKeyFiles, database)
            this.addPath = addGenerator(this.#storeNamePaths, this.#storeKeyPaths, database)

            if(needsINIT){ // initialize file system for the default
                const store = database.transaction(this.#storeNamePaths, 'readwrite').objectStore(this.#storeNamePaths)
                init.forEach((path) => {
                    store.add(path)
                })
            }

            doneLoading(this)
        })

    }

    moveToFolder (folderName) {
        if(folderName === ".." && this.#current_path.length > 1){
            this.#current_path.pop()
            return;
        }
        
        this.accessPath(this.#current_path, (filesAtPath) => {
            if(filesAtPath && filesAtPath.find((f) => f.name===folderName)?.type === "folder") {
                this.#current_path.push(folderName)
            }
        })
    
    }

    async listAllAtPath () {
        let ret = []
        await this.accessPath(this.#current_path, (filesAtPath) => {
            if(filesAtPath){
                ret = filesAtPath
            }
        })

        return ret
    }

    async removeFile (fileName, path=this.#current_path) {
        const fileKey = [path, fileName]

        await this.deleteFile(fileKey)

        const filesAtPath = await this.accessPath(path)
        if(filesAtPath){
            const cloneMinusFile = filesAtPath.slice(0).filter((file) => file.name !== fileName || file.type === "folder")

            await this.deletePath(path)
            await this.addPath(path, cloneMinusFile)
        }
        
    }

    async removeFolder(folderName, recursive=false, path=this.#current_path) {
        

        const pathOfFolderToDelete = [...path, folderName]
        const allFilesInFolder = await this.accessPath(pathOfFolderToDelete)
        const clone = allFilesInFolder ? allFilesInFolder.slice(0): []

        if(!allFilesInFolder?.length || recursive){
            const filesAtPath = await this.accessPath(path)

            if(filesAtPath){
                const cloneMinusFolder = filesAtPath.slice(0).filter((folder) => folder.name !== folderName)

                await this.deletePath(path)
                await this.addPath(path, cloneMinusFolder)
            }
            
            await this.deletePath(pathOfFolderToDelete)

        }
        if(recursive){
            // if folder has any contents
            clone.forEach((file) => {
                if(file.type==="file"){
                    this.removeFile(file.name, pathOfFolderToDelete)
                }else if(file.type==="folder")
                    this.removeFolder(file.name, true, pathOfFolderToDelete)
            })

        }

    }

    async addFolderToPath (folderName) {

        const existingFilesAtLocation = await this.accessPath(this.#current_path)
        

        if(existingFilesAtLocation){
            const clone = existingFilesAtLocation.slice(0)

            if(!existingFilesAtLocation.find(f => f.name === folderName)){
                // add to path
                await this.deletePath(this.#current_path)
                await this.addPath(this.#current_path, [...clone, {name: folderName, type: "folder"}])
            }

        }else{
            await this.addPath(this.#current_path, [{name: folderName, type: "folder"}])
        }

        
    }

    async addFileToPath (fileName, file) {
        
        const fileKey = [this.#current_path, fileName]

        const existingFilesAtLocation = await this.accessPath(this.#current_path)
        
        if(existingFilesAtLocation && !existingFilesAtLocation.find(f => f.name === fileName)) {
            await this.addFile(fileKey, file)

            const clone = existingFilesAtLocation.slice(0)
            await this.deletePath(this.#current_path)
            await this.addPath(this.#current_path, [...clone, {name: fileName, type: "file"}])
           
        }else{
            await this.addFile(fileKey, file)
            await this.addPath(this.#current_path, [{name: fileName, type: "file"}])
        }
            

    }

    getPath () {
        return this.#current_path.join('/')
    }

    async openFile(fileName, path=this.#current_path) { 

        const fileKey = [path, fileName]

        const file = await this.accessFile(fileKey)

        if(!file){
            const fileKeyStr = fileKey.flat(1).join('/')
            if(builtIn[fileKeyStr] && (await this.accessPath(path)).find(f => f.name === fileName)){
                if(typeof builtIn[fileKeyStr] === "string"){
                    const getContents = require("./"+builtIn[fileKeyStr])
                    return getContents().split('\n')
                }

                return builtIn[fileKeyStr]
            }
 
        }
        
        return file
    }

}
