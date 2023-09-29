const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT || 6000;

const userRouter = require('./routes/UserRoute');
app.use('/user', userRouter)

app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
})