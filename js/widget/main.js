'use strict';

const Dropin = require('widget/dropin');
const bus = require('framebus');

exports.setup = function(selector){
  const w = new Dropin();
  w.appendTo(selector);
  w.on('ready', function(target, data){
    console.log("Child ("+data.url+") reported ready");
  });
};
