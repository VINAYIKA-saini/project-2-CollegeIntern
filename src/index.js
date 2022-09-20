const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const multer = require('multer');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(multer().any());
app.use(bodyParser.urlencoded({ extended: true }));



mongoose.connect("mongodb+srv://Project_2:LcVtXMRHaDBMwpLq@cluster0.u6u38bx.mongodb.net/Project_2", {
    useNewUrlParser: true
})
.then(() => console.log("MongoDb is connected"))
.catch(err => console.log(err))



app.use('/', router);

app.listen(process.env.PORT || 3001, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3001))
});