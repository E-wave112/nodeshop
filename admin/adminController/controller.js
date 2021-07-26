const Admin = require('../adminModels/admin')
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err)  =>{
    console.log(err.message, err.code)
    let errors =  {mail :'', password:''};

    //incorrect email
    if (err.message === 'incorrect mail'){
        errors.mail = 'that email is not registered'
    }

    //incorrect email
    if (err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }
    //duplicate error code
    if (err.code === 11000){
        errors.mail = 'that email is already taken'
        return errors
    }
    //validation errors
    if (err.message.includes('data validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
            //console.log(properties)
        })
    }
    return errors
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_TOKEN, {
        expiresIn:maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');

}

module.exports.login_get = (req, res) => {
    res.render('Adminlogin');
    
}

module.exports.signup_post = async (req, res) => {
    const {mail, password} = req.body;
    try{
       const user = await Admin.create({mail, password});
       const token = createToken(user._id)
       res.cookie('jwt',token,{ httpOnly: true ,maxAge: maxAge*1000})
       res.status(201).json({user:user._id}) 
    }

    catch (err){
       const errors =  handleErrors(err)
       res.status(400).json({errors})
    }
    
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
    
}

module.exports.login_post = async (req, res) => {
    const { mail, password } = req.body;

    try{
       const user = await Admin.login(mail,password)
       const token = createToken(user._id)
       res.cookie('jwt',token,{ httpOnly: true ,maxAge: maxAge*1000})
       res.status(200).json({user:user._id})
    }
  catch (err){
      const errors = handleErrors(err)
      res.status(400).json({errors})
    }
}

module.exports.logout_get = (req, res) =>{
    res.cookie('jwt','',{ httpOnly: true, maxAge:1})
    res.redirect('/')
}