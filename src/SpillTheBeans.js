import fs from "fs"


function convertToArr(str) {
    var data = [];

    var tmp = "";

    for (let i = 0; i < str.length; i++) {
        if (!str[i].includes(" ") && !str[i].includes("\n")) {
            tmp += str[i];
        }
        else {
            data.push(tmp)
            tmp = "";
        }
    }
    return data;
}


function characters() {
    var lower = "abcdefghijklmnopqrstuvwxyz";
    var upper = "ABCDHEFGHIJKLMNOPQRSTUVWXYZ";
    var special = "`~!@#$%&^*()_+-={[}]|\\:\"'/?.>, <";
    var numbers = "1234567890";
    var space = "\n";

    var chars = special + lower + numbers + space + upper + special;

    return chars;
}

function decode(data) {
    var dataArray = []

    for (let i = 0; i < data.length; i++) {
        dataArray.push(getDecodedValue(data[i],characters()))
    }

    return dataArray;
}

function getDecodedValue(character,characters) {
    for (let i = 0; i < characters.length; i++) {
        if (i == character) {
            return characters[i];
        }
    }
}

function checkPassword(dataArray,password,characters) {

    var pwdFreeArr = [];

    var decodedData = decode(dataArray,characters)
    pwdFreeArr = decodedData.slice(0);
    var decodedPass = "";
    
    if (dataArray[0] != password.length) {
        console.log("You can't break me :P - Come back with the correct password.");
        return;
    }

    if ((dataArray.length - (password.length+1)) > password.length) {

        var count = 0;

        for (let i = 1; i < (password.length+1); i++) {
            pwdFreeArr.splice((i*2)-count,1)
            count += 1;
            decodedPass += decodedData[(i*2)];
        }

        if (dataArray[0] != password.length) {
            console.log("You can't break me :P - Come back with the correct password.");
            return;
        }
    }
    
    if ((dataArray.length - (password.length+1)) < password.length) {
        var dl = (dataArray.length - (password.length+1))
        var pl = dataArray[0];
        var tmp = 0;
        pwdFreeArr = [" "];
        decodedData.splice(0,1);


        for (let i = 0; i < decodedData.length; i++) {
            if (i % 2 == 0) {
                if (pwdFreeArr.length <= dl) {
                    pwdFreeArr.push(decodedData[i])
                }
            }
            if (tmp <= dl) {
                if (i % 2 != 0) {
                    decodedPass += decodedData[i];
                }
                tmp += 1;
            }
            else {
                decodedPass += decodedData[i];
            }
            
        }

    }

    if (decodedPass != password) {
        console.log("You can't break me :P - Come back with the correct password.");
        return;
    }

    console.log(pwdFreeArr)

    return pwdFreeArr;
}

function arrayHumanReadable(data) {

    var string = ""
    data.splice(0,1)

    data.forEach(element => {
        string += element
    });

    return string;
}

export default function spillTheBeans(options) {
    
    fs.readFile(options["file"],{encoding:"utf-8"}, function extractContent (err,data) {
        if (err) {
            console.log(err);
        }
        data = convertToArr(data);
        data = checkPassword(data,options["password"],characters());
        data = arrayHumanReadable(data);

        if (!options["overwrite"]) {
            fs.writeFile("./unlocked.txt",data, function (err) {
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