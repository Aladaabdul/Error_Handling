const { error } = require("console")
const express = require("express")
const fsPrromises = require("fs").promises

const PORT = 3000
const app = express()

app.use(express.static("public"))
app.use(express.json());

//Synchronous error is handle by Express // Not good server will crash
app.get("/", (req, res) => {
    throw new Error("Hello Error");
})

// Asynchronous error is not handle by Express // Not good server will crash
app.get("/file", async(req, res) => {
    const file = await fsPrromises.readFile('./no-such-file.txt')
    res.sendFile(file)
})

// Handle Error
app.get("/text", async(req, res, next) => {
    try{
        const file = await fsPrromises.readFile("./no-such-file.txt")
        res.sendFile(file);
    } catch (error) {
        error.type = 'Not Found'
        next(error)
    }
})
app.get("/user", async(req, res, next) => {
    try{
        const file = await fsPrromises.readFile("./no-such-file.txt")
        res.sendFile(file);
    } catch (error) {
        error.type = 'Redirect'
        next(error)
    }
})



// Handling Asynchrnous Error using middleware
app.use((error, req, res, next) => {
    console.log("Error Handling Middleware")

    if (error.type == 'Redirect'){
        res.redirect('error.html')
    }
    else if (error.type == 'Not Found'){
        res.status(404).send("File Not Found")
    }else{
        res.status(500).send(error)
    }

    next();
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
