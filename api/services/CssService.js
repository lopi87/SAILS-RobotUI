
module.exports = {

  valid_color: function (color){
    var valid = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    return valid;
  }

};
