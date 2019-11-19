const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport')
const dotenv = require('dotenv');

const appLog = require('./app-log')
const testAPIRouter = require('./routes/testAPI');
const nickRouter = require('./routes/nick');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    maxAge: 1800 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

const whitelist = ['http://localhost:3000', 'https://activity-map.nicksynes.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
app.use(cors(corsOptions));
app.use(appLog)

app.use('/testAPI', testAPIRouter);
app.use('/nick', nickRouter);
app.use('/auth', authRouter);

module.exports = app;
