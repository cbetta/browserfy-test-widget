'use strict';

var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var bus = require('framebus');

inherits(Widget, EventEmitter);
module.exports = Widget;

function Widget (opts) {
    if (!(this instanceof Widget)) return new Widget(opts);
    this.element = document.createElement('iframe');
    this.element.setAttribute('src', 'http://localhost:3001/');
}

Widget.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);

    var _this = this;
    bus.on('widget-message', function (message) {
      _this.emit(message.method, target, message.data);
      bus.emit('parent-message', document.location.href);
    });

    target.appendChild(this.element);
};
