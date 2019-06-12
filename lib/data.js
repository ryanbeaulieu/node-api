// Storing and editing data

const fs = require('fs');
const path = require('path');

let lib = {};

//Base Director for the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
    // Open the file for writing
    fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", (err,fileDesc) => {
        if(!err && fileDesc) {
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDesc, stringData, (err) => {
                if(!err) {
                    fs.close(fileDesc,(err) => {
                        if(!err) callback(false); 
                        else callback('Error closing new file');
                    });
                }else {
                    callback('Error writing to new file');
                }
            });
        }else {
            callback('Could not create new file, it may already exists');
        }
    })
};

// Read data to a file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf-8", (err,data) => {
        callback(err,data);   
    })
}

// Update existing file
lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", (err,fileDesc) => {
        if(!err && fileDesc) {
            const stringData = JSON.stringify(data);

            // Truncate contents of the file before writing to the file
            fs.truncate(fileDesc, (err) => {
                if(!err) {
                    fs.writeFile(fileDesc, stringData, (err) => {
                        if(!err) {
                            fs.close(fileDesc, (err) => {
                                if(!err) callback(false); else callback('Error closing file');   
                            })
                        }else callback('Error writing to existing file');
                    });
                }else callback('Error truncating file');
            })
        }else {
            callback('Could not open the file to update. This file may not exist yet');
        }
    })
}

// Delete File
lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir + dir + "/" + file + ".json", (err) => {
        if(!err) callback(false); else callback('Error trying to delete file');
    });
}

module.exports = lib;