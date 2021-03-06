/* Components */
var Slider = require('../components/Slider');
var Launcher = require('../components/Launcher');
var Toggler = require('../components/Toggler');
var ColorPicker = require('../components/ColorPicker');

/* Type checkers */
var isNumber = require('../utils/is-number');
var isFunction = require('../utils/is-function');
var isBoolean = require('../utils/is-boolean');

function ComponentContainer() {
  this.$el = document.createElement('div');
  this.$content = this.$el;
  this.childComponents = [];
}

ComponentContainer.prototype.add = function(object, property, options) {
  var component = null;
  if(isBoolean(object[property])) {
    component = this.addToggler(object, property, options);
  }
  else if(isNumber(object[property])) {
    component = this.addSlider(object, property, options);
  }
  else if(isFunction(object[property])) {
    component = this.addLauncher(object, property, options);
  }
  component._applyStyles(this.theme);
  return component;
};

ComponentContainer.prototype.addSlider = function(object, property, options) {
  var slider = new Slider(object, property, options);
  this.addComponent(slider);
  return slider;
};

ComponentContainer.prototype.addLauncher = function(object, property, options) {
  var launcher = new Launcher(object, property, options);
  this.addComponent(launcher);
  return launcher;
};

ComponentContainer.prototype.addToggler = function(object, property, options) {
  var toggler = new Toggler(object, property, options);
  this.addComponent(toggler);
  return toggler;
};

ComponentContainer.prototype.addColorPicker = function(object, property, options) {
  var colorPicker = new ColorPicker(object, property, options);
  this.addComponent(colorPicker);
  colorPicker._applyStyles(this.theme);
  return colorPicker;
};

ComponentContainer.prototype.addComponent = function(component) {
  component.appendTo(this.$content);
  this.childComponents.push(component);
};

ComponentContainer.prototype._applyStyles = function() {
  for (var i = 0, l = this.childComponents.length; i < l; i++) {
    this.childComponents[i]._applyStyles(this.theme);
  }
};

ComponentContainer.prototype.remove = function() {
  for (var i = 0, l = this.childComponents.length; i < l; i++) {
    this.childComponents[i].remove();
  }
  if(this.$el.parentNode) {
    this.$el.parentNode.removeChild(this.$el);
    this.$el = null;
  }
};

ComponentContainer.prototype.appendTo = function($element) {
  $element.appendChild(this.$el);
};

module.exports = ComponentContainer;
