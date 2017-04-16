import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

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
    return 'admin.show';
  },
});
