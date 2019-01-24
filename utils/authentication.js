function isUserLogged(req, res, next){

   if(req.isAuthenticated()){
       return next(); 
   }
  return res.status(403).json({"message" : "not allowed"});
}

module.exports = { isUserLogged }