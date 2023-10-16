const express = require('express');
const { sequelize, dbConnection } = require('./database/connection')
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT;
console.log(PORT)
const cors = require('cors');
const winston = require('winston');
const File = require('./models/File');

winston.configure({
    transports: [new winston.transports.Console()],
});


(async () => {
    await dbConnection();
    await sequelize.sync();
})();

app.use(cors());
const fileRouter = require('./routes/FileRoute');
app.use('/file', fileRouter);

app.listen(PORT, () => {
    winston.info(`Server is listening on port : ${PORT}`);
})