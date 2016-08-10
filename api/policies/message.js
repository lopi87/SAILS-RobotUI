module.exports = function(req, res, next) {
  res.locals.n_messages = 0;

  if(req.session.User && req.session.User.id){
    Message.count({to_user_id: req.session.User.id , read: false}).exec(function (err, n_messages){
      if(err) return next(err);
      res.locals.n_messages = n_messages;
      return next();
    });
  }else{
    res.locals.n_messages = 0;
    return next();
  }

};
