
var Widget = function() {};

Widget.prototype = {
  start: function() {
    this._suscribeEvents();
    this._start();
  },

  _start: function() {
  },

  stop: function() {
    this._stop();
  },

  _stop: function() {
  },
};

Widget.mixin = function(source, target) {
  for (var prop in target) {
    source[prop] = target[prop];
  }
};

Widget.create = function(constructor, prototype) {
  constructor.prototype = Object.create(Widget.prototype);
  constructor.prototype.constructor = constructor;
  if (constructor.EVENTS) {
    Widget.mixin(constructor.prototype, {
      _suscribeEvents: function() {
        this.constructor.EVENTS.forEach(function(event) {
          window.addEventListener(event, this['_on_' + event].bind(this));
        }, this);
      }
    });
  }
  if (prototype) {
    Widget.mixin(constructor.prototype, prototype);
  }
  return constructor;
};

// CREATE WIDGET

var Carousal = function() {
};

Carousal.EVENTS = ['message'];

var CarousalModule = Widget.create(Carousal, {
  '_on_message': function(evt) {
    var detai = JSON.parse(evt.data);
    console.log('__ from parent message ___');
    console.log('parent height is ' + detai.data.windowHeight);
    console.log('parent width is ' + detai.data.windowWidth);
  },

  _start: function() {
  }
});

window.onload = function() {
  if (top !== self) {
    top.postMessage('*', '*');
    var carousal = new CarousalModule();
    carousal.start();
  }
};