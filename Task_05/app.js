const express = require('express');
const { dbConnection } = require('./database/connection')
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT
const winston = require('winston');
// const User = require('./models/User');

winston.configure({
    transports: [new winston.transports.Console()],
});

dbConnection();

// app.get('/', async (req, res) => {
//     res.status(200).json({ message: 'Hello World!' });
// })
// app.post('/register', async (req, res) => {
//     try {
//         if (req.body !== undefined && req.body !== null && Object.keys(req.body).length > 0) {
//             const { first_name, last_name, email, phone, address, role, password } = req.body;
            // const hashedPassword = await bcrypt.hash(password, 10)

//             const user = await User.create({
//                 first_name,
//                 last_name,
//                 email,
//                 phone,
//                 address,
//                 role,
//                 password: hashedPassword,
//             });
//             res.status(201).json({ message: 'User registered successfully', user });
//         } else {
//             res.status(401).json({ message: 'Bad request: Data missing' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Error registering user' })
//     }
// });

const userRouter = require('./routes/UserRoute');
app.use('/user', userRouter);

app.listen(PORT, () => {
    // console.log(`Server is listening on port : ${PORT}`);
    winston.info(`Server is listening on port : ${PORT}`);
})