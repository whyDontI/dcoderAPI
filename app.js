const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const passport = require('passport');

const app = express();

// Passport config
// require('./config/passport')(passport);

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// DB Config
const db = require('./config/keys').MongoURI;

// Connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
	.then(() => console.log("MongoDB Connected..."))
	.catch( err => console.log(err));
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/thread', require('./routes/threads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Listening on ", PORT));
