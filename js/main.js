var Widget = require('app/widget');

exports.setup = function(selector){
  var w = new Widget();
  w.appendTo(selector);
}
