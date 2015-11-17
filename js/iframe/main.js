'use strict';

var bus = require('framebus');

bus.emit('widget-message', {
  method: 'ready',
  data: {
    url: document.location.href
  }
});


bus.on('parent-message', function (data) {
  console.log('Parent ('+data+') reported back');
});
