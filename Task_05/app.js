const express = require('express');
const { dbConnection } = require('./database/connection')
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT
const winston = require('winston');

winston.configure({
    transports: [new winston.transports.Console()],
});

dbConnection();

const userRouter = require('./routes/UserRoute');
app.use('/user', userRouter);

app.listen(PORT, () => {
    winston.info(`Server is listening on port : ${PORT}`);
})