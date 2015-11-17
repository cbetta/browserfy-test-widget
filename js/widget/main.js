'use strict';

var Dropin = require('widget/dropin');
var bus = require('framebus');

exports.setup = function(selector){
  var w = new Dropin();
  w.appendTo(selector);
  w.on('ready', function(target, data){
    console.log("Child ("+data.url+") reported ready");
  });
};
