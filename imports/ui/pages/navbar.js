import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

import { Notifications } from '../../api/notifications.js';

Template.atNavButtonCustom.replaces('atNavButton');

Template.navbar.onRendered(() => {
  $('.ui.dropdown')
    .dropdown()
  ;
});

Template.navbar.helpers({
  userEmail() {
    return Meteor.user().emails[0].address;
  },
  userRole() {
    if (!Meteor.user()) {
      return '#';
    }
    const role = Meteor.user().profile.role;
    if (role === 1) {
      return 'student.show';
    } else if (role === 2) {
      return 'teacher.show';
    }
    return '#';
  },
  about() {
    if (!Meteor.user()) {
      return '#';
    }
    const role = Meteor.user().profile.role;
    if (role === 1) {
      return 'student.about';
    } else if (role === 2) {
      return 'teacher.about';
    }
    return '#';
  },
  isStudent() {
    if (!Meteor.user()) {
      return '#';
    }
    return Meteor.user().profile.role === 1;
  },
});

Template.notifications.onCreated(function created() {
  this.autorun(() => {
    this.subscribe('notifications');
  });
});

Template.notifications.onRendered(function init() {
  this.autorun(() => {
    if (Meteor.user()) {
      $('.ui.scrolling.dropdown')
        .dropdown()
      ;
    }
  });
});

Template.notifications.helpers({
  notificationCount() {
    return Notifications.find({}).count();
  },
  notifications() {
    return Notifications.find({});
  },
});

Template.notifications.events({
  'click #clear-notifications': function clearNotifications() {
    Meteor.call('notifications.clear');
  },
});

Template.notificationItem.events({
  'click .notification.item': function seenNotification() {
    Meteor.call('notifications.seen', this._id);
  },
});
