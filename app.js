const express = require("express")
const app = express()
const path = require('path')

//middleware
//Access the public folder where the client will have free access to and able to veiw the html files but as ejs
app.use(express.static(path.join(__dirname, './public')))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connects the server to all the availabe routes and have a deafult url begining of /api
const apiRouter = require("./routes/api_routes")
app.use("/api", apiRouter)
const page = require("./routes/users_routes")

app.use("/",page)
















// Export the app to be used by server.js
module.exports = app;