import arg from "arg";
import inquirer from "inquirer";
import keepMySecret from "./KeepMySecret.js";
import spillTheBeans from "./SpillTheBeans.js";

function parseArgs(rawArgs) {
    
    let args = {};

    try {
        args = arg(
            {
                "--help": Boolean,
                "-h": "--help",
                "--file": String,
                "-t": "--file",
            },
            {
                argv: rawArgs.slice(2)
            }
        );
    } catch (error) {
        
        if (error["code"] == "ARG_MISSING_REQUIRED_LONGARG") args["--file"] = false;
    }

    return {
        help: args["--help"] || false,
        file: args["--file"],
    }
}

async function chooseTask(options) {
    const questions = []
    questions.push({
        type: 'list',
        name: "selection",
        message: "What would you like me to do? ;)",
        choices: [
            "Keep a secret. B-)",
            "Spill the beans!",
        ]
    })

    const answers = await inquirer.prompt(questions);

    return {
        selection: answers.selection,
        file: options["file"]
    }
}

async function selectFile() {
    const questions = []
    questions.push({
        type: 'input',
        name: "file",
        message: "Please specify the path to the file that you want to scramble :",
    })

    const answers = await inquirer.prompt(questions);

    return {
        file: answers.file
    }
}

async function spill(options) {
    const questions = []
    questions.push({
        type: 'input',
        name: "password",
        message: "Alright but first, what's the password? :P :",
    })

    const answers = await inquirer.prompt(questions);

    return {
        password: answers.password,
        file: options["file"],
        selection: options["selection"]
    }
}

async function secret(options) {
    const questions = []
    questions.push({
        type: 'input',
        name: "password",
        message: "I won't tell anyone. Promise ;) - What's the secret? :",
    })

    const answers = await inquirer.prompt(questions);

    return {
        password: answers.password,
        file: options["file"],
        selection: options["selection"]
    }
}

async function overwrite(options) {
    const questions = []
    questions.push({
        type: 'list',
        name: "overwrite",
        message: "Oh and one last thing! Shall I overwrite the original file?",
        choices: [
            "No way, I don't trust you. :P",
            "Yes, overwrite the original file. I won't blame you for anything. <3 xoxoxo",
        ]
    })

    const answers = await inquirer.prompt(questions);

    return {
        overwrite: (answers.overwrite != "No way, I don't trust you. :P"),
        password: options["password"],
        file: options["file"],
        selection: options["selection"]
    }
}


export async function cli(args) {

    // if (args[2] == "test") {
    //     console.log("keepMySecret TEST")

    //     var ow = { overwrite: true,
    //         password: '12345',
    //         file: './t.txt',
    //         selection: 'Keep a secret. B-)'
    //     };
    //     spillTheBeans(ow);
    //     return;
    // }

    args = parseArgs(args);

    if (args["help"] == true) {
        console.log(
            "Please specify the path to the file file using -t or -file"
        )
        return false;
    }

    if (!args["file"]) {
        args = await selectFile(args);
    }

    var task = await chooseTask(args);

    console.log(task)

    if (task["selection"] == "Spill the beans!") {
        var opts = await spill(task);
        var ow = await overwrite(opts);
        spillTheBeans(ow);
    }
    
    if (task["selection"] == "Keep a secret. B-)") {
        var opts = await secret(task);
        var ow = await overwrite(opts);
        keepMySecret(ow);
    }
}