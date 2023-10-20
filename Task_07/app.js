const express = require('express');
const { sequelize, dbConnection } = require('./database/connection');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
var PORT = process.env.PORT;
const cors = require('cors');
const winston = require('winston');
const User = require('./models/User');

winston.configure({
    transports: [new winston.transports.Console()],
});


(async () => {
    await dbConnection();
    await sequelize.sync();
})();

app.use(cors());
const userRouter = require('./routes/UserRoute');
app.use('/user', userRouter);

app.listen(PORT, () => {
    winston.info(`Server is listening on port : ${PORT}`);
})