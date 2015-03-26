
var Widget = function(container) {
  this.container = container;
  this.type = this.container.dataset.widget;

};

Widget.prototype = {
  get containerWidth() {
    return this.container.clientWidth;
  },
  get containerHeight() {
    return this.container.clientHeight;
  },
  get windowWidth() {
    return window.innerWidth;
  },

  get windowHeight() {
    return window.innerHeight;
  },

  start: function() {
    this.iframe = document.createElement('iframe');
    this.src = this.type + '/index.html';
    this.iframe.src = this.src;
    this.iframe.height = this.containerHeight;
    this.iframe.width = this.containerWidth;
    this.container.appendChild(this.iframe);
    this.addListener();
  },

  addListener: function() {
    this.iframe.addEventListener('load', this);
    window.addEventListener('resize', this);
    window.addEventListener('message', this);
  },

  handleEvent: function(evt) {
    switch(evt.type) {
      case 'resize':
        this._onResize();
        break;
      case 'load':
        break;
      case 'message':
        this.source = evt.source;
        break;
    }
  },

  _onResize: function() {
    var containerWidth = this.containerWidth;
    var containerHeight = this.containerHeight;
    var windowWidth = this.windowWidth;
    var windowHeight = this.windowHeight;
    this.publishEvent({
      type: 'resize',
      data: {
        containerWidth: containerWidth,
        containerHeight: containerHeight,
        windowWidth: windowWidth,
        windowHeight: windowHeight
      }
    });
  },

  publishEvent: function(data) {
    this.source && this.source.postMessage(JSON.stringify(data), '*');
  }
};

window.onload = function() {
  var widget1 = document.querySelector('[data-widget="courasal"]');
  if (widget1) {
    var newWidget = new Widget(widget1);
    newWidget.start();
  }
};


