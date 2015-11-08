var Widget = require('app/widget');
var bus = require('framebus');

exports.setup = function(selector){
  var w = new Widget();
  w.appendTo(selector);
  w.on('ready', function(target, data){
    console.log("Child ("+data.url+") reported ready");
  });
};
