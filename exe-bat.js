const child_process = require("child_process")

const exeBat = (batPath) => {
    console.log(`exeBat: ${batPath}`)
    console.log('......')
    child_process.execFile(batPath, [], {}, (error, stdout, stderr) => {
        if (error !== null) {
            console.log("exec error: " + error)
        } else {
            console.log("success: " + stdout)
        }
        console.log('stderr: ' + stderr);
    })
}

module.exports = exeBat
