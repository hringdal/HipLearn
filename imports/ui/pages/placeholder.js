import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';

Template.placeholder.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.placeholder.onRendered(() => {
  $('body').addClass('hippo');
});


Template.placeholder.onDestroyed(() => {
  $('body').removeClass('hippo');
});

Template.placeholder.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.placeholder.events({
  'click button': function clickButton(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
