module.exports = {
    ensureAuth: function(req,res,next){
        if (req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/login')
        }
    },
    ensureGuest: function (req,res,next){
        if (!req.isAuthenticated()) {
            return next();
          } else {
            res.redirect('/');
          }
    },
    accessControl: function(req,res,next){
        if (req.isAuthenticated()){
            if (!req.body.token){
                return res.redirect('/')
            } else {
                next()
            }
        } else {
            res.redirect('/login');
        }
    }
}