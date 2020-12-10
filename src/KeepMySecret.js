const fs = require("fs");


function characters() {
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = "ABCDHEFGHIJKLMNOPQRSTUVWXYZ";
    var special = "`~!@#$%&^*()_+-={[}]|\\:\"'/?.>, <";
    var numbers = "1234567890";
    var space = "\n";

    var chars = special + lower + numbers + space + upper + special;

    return chars;
}

function encode(data) {
    
    var dataArray = []

    for (let i = 0; i < data.length; i++) {
        dataArray.push(getEncodedValue(data[i],characters()))
    }

    return dataArray;
}

function setPassword(dataArray,password) {

    var pwdDataArray = []

    var encPass = encode(password)
    
    dataArray.forEach((ele,i) => {
        if (i == 0) {
            pwdDataArray.push(password.length);
        }
        
        pwdDataArray.push(ele);
        if (encPass[0] != undefined) {
            pwdDataArray.push(encPass[0]);
        }
        encPass.splice(0,1);

        if (i === (dataArray.length-1)) {
            encPass.forEach(ele => {
                pwdDataArray.push(ele)
            })
        }
        
    });

    return pwdDataArray;
}

function getEncodedValue(character,characters) {
    for (let i = 0; i < characters.length; i++) {
        if (characters[i] === character) {
            return i;
        }
    }
}

function replaceWithSpaces(arr) {
    
    var data = "";
    var count = 0;

    for (let i = 0; i < arr.length; i++) {
        count += 1;
        
        if (count > 20) {
            data += arr[i] + "\n";
            count = 0;
        }
        else {
            data += arr[i] + " ";
        }
    }
    
    return data;
}

export default function keepMySecret(options) {
    

    fs.readFile(options["file"],{encoding:"utf-8"}, function extractContent (err,data) {
        if (err) {
            console.log(err);
        }
        
        var dataArray = encode(data);
        var pwdProtectedArr = setPassword(dataArray,options.password);
        
        var data = replaceWithSpaces(pwdProtectedArr);

        if (!options["overwrite"]) {
            fs.writeFile("./secret.txt",data, function (err) {
                if (err) throw err;
                console.log('File created.');
            });
        }

        if (options["overwrite"]) {
            fs.writeFile(options["file"],data, function (err) {
                if (err) throw err;
                console.log('File overwritten.');
            });
        }
    });

};