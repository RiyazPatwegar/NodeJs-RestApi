const express = require("express");
const bodyParser = require('body-parser');
const userRouter = require("./routes/user-route");
const db = require("./util/database");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/signup', userRouter);

/*query execution through pool connection */
/* db.execute("SELECT * FROM users").
then((result) => {
    console.log(result[0]);
    console.log(result[0][0].name);
}).
catch((err) => {
    console.log(err);
    console.log("Connection failed!");
}); */

app.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({statusCode: status, message: message, data: data});    
});

app.listen(8080);