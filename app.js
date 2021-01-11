//declare he required imports
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const fs = require('fs');
const multer = require('multer');
const dotenv = require('dotenv').config({path:__dirname+'/.env'});
const csrf = require('csurf');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const passportAuth = require('./config/passport')(passport);
const port=process.env.PORT

///intitilaize the app
const app = express()

// body parsermiddlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//morgan middleware
app.use(morgan('dev'))
//multer middleware
const upload = multer({ dest: 'uploads/' })
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

//intialize passport and passport sessions
app.use(passport.initialize())
app.use(passport.session())


//routes
app.use('/', require('./routes/eroutes'))
app.use('/auth', require('./routes/auth'))



app.listen(port, ()=> {
    
    console.log(`server running  on port ${port}`)

})