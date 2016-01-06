'use strict';

const bus = require('framebus');

bus.emit('widget-ready', {
  method: 'ready',
  data: {
    url: document.location.href
  }
});


bus.on('parent-ready', function (data) {
  console.log('Parent ('+data+') reported back');
});

bus.on('submit', function (data) {
  let name = document.getElementById('name')
  bus.emit('widget-data', {name: name.value});
})
