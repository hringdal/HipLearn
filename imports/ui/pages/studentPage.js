import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Courses } from '../../api/courses.js';

Template.studentPage.onCreated(function created() {
  this.autorun(() => {
    this.subscribe('courses');
  });
});

Template.studentPage.helpers({
  // fixes error with getting data before collection is ready
  authInProcess() {
    return Meteor.loggingIn();
  },
  selectedCourse() {
    return FlowRouter.getParam('courseId');
  },
  course() {
    return Courses.findOne(FlowRouter.getParam('courseId'));
  },
  isTeacher() {
    if (!Meteor.user()) {
      return false;
    }
    return Meteor.user().profile.role === 2;
  },
});
