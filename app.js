//declare  required imports
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv').config({path:__dirname+'/.env'});
const csrf = require('csurf');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
require('./config/passport')(passport);
const port=process.env.PORT

///intitilaize the app
const app = express()
//cookie parser middlweware
app.use(cookieParser())
//csurf middleware
var parseForm = bodyParser.urlencoded({ extended: false });
const csrfProtection = csrf({cookie:true});


//middleware csp for protection against xss attacks
app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self';");
    next();
  });

//moddleware for protection against clickjacking attacks
app.use(function(req, res, next) {
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self';");
    next();
  })
  
//morgan middleware
app.use(morgan('dev'))
//set the ejs view engine
app.set('view engine', 'ejs')

//static folder 
app.use(express.static(path.join(__dirname,'public')))

//database connection 
const connectDB = async () =>{
    try {
        const connect = await mongoose.connect(process.env.dbURI, 
           {useCreateIndex:true,
           useUnifiedTopology:true,
           useNewUrlParser:true
       },
       console.log('connected to db'))
       
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
connectDB()

//session database storage
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false, 
    store: new MongoStore({mongooseConnection:mongoose.connection})
},{
//     cookie:
//     sameSite
}
))

//write script logic that will enable the cart to be in session

//intialize passport and passport sessions
app.use(passport.initialize())
app.use(passport.session())


//routes
app.use('/', require('./routes/eroutes'))
app.use('/auth', require('./routes/auth'))
app.use('/process',require('./routes/paymentroutes'))



app.listen(port, ()=> {
    
    console.log(`server running  on port ${port}`)

})