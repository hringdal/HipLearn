import { Template } from 'meteor/templating';

Template.onlyIfAdmin.helpers({
  canShow() {
    if (Meteor.user()) {
      return Meteor.user().profile.role === 2;
    }
    return false;
  },
});
