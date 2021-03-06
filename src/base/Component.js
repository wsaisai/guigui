var css = require('../utils/styles/css');
var computeComponentStyle = require('../styles/component');
var Emitter = require('component-emitter');
var loop = require('raf-loop');

function Component(object, property, options) {
  options = options || {};

  this.onWatch = this.onWatch.bind(this);
  this.theme = '';

  this.theme = options.theme || 'dark';
  this.isWatched = options.watch === true;

  this.$el = document.createElement('div');

  this._targetObject = object;
  this._targetProperty = property;
  this._value = object[property];

  if (this.isWatched) {
    this.engine = loop(this.onWatch);
    this.engine.start();
  }
}

Emitter(Component.prototype);

Component.prototype.appendTo = function($element) {
  $element.appendChild(this.$el);
};

Component.prototype.remove = function() {
  if(this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
  }
  if (this.isWatched) {
    this.engine.stop();
  }
};

Component.prototype.invalidate = function() {
  this._value = this._targetObject[this._targetProperty];
};

Component.prototype.onStartInteraction = function() {
  if (this.isWatched) {
    this.engine.stop();
  }
};

Component.prototype.onEndInteraction = function() {
  if (this.isWatched) {
    this.engine.start();
  }
};

Component.prototype._applyStyles = function(theme) {
  this.theme = theme;
  var componentStyle = computeComponentStyle(theme);
  css(this.$el, componentStyle);
};

Component.prototype.onWatch = function() {
  if (this._targetObject[this._targetProperty] !== this._value) {
    this.invalidate();
  }
};

module.exports = Component;
