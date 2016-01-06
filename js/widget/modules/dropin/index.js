'use strict';

const inherits = require('inherits');
const EventEmitter = require('events').EventEmitter;
const bus = require('framebus');


class Widget extends EventEmitter{
  constructor(opts) {
    super();
    this.element = document.createElement('iframe');
    this.element.setAttribute('src', 'http://localhost:3001/');
  }

  appendTo(target) {
      if (typeof target === 'string') target = document.querySelector(target);

      this.handleMessages(target);
      this.interceptSubmit(target);

      target.appendChild(this.element);
  };

  handleMessages(target) {
    bus.on('widget-ready', (message) => {
      this.emit(message.method, target, message.data);
      bus.emit('parent-ready', document.location.href);
    });
  }

  interceptSubmit(target) {
    let form = target;
    while (form && form.nodeName != 'FORM') {
      form = form.parentNode;
    }

    bus.on('widget-data', (data) => {
      document.getElementById('result').textContent = `Name: ${data.name}`;
    });

    form.addEventListener('submit', (event)=>{
      event.preventDefault();
      bus.emit("submit");
    })
  }
}

module.exports = Widget;
