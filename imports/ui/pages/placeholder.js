import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

import './placeholder.html';

Template.Placeholder.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.Placeholder.onRendered(() => {
  $('body').addClass('hippo');
});


Template.Placeholder.onDestroyed(() => {
  $('body').removeClass('hippo');
});

Template.Placeholder.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.Placeholder.events({
  'click button': function clickButton(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
