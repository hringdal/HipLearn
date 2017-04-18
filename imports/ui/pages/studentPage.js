import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Courses } from '../../api/courses.js';

Template.studentPage.helpers({
  // fixes error with getting data before collection is ready
  authInProcess() {
    return Meteor.loggingIn();
  },
  selectedCourse() {
    console.log('selected course id: ', FlowRouter.getParam('courseId'));
    return FlowRouter.getParam('courseId');
  },
  course() {
    return Courses.findOne(FlowRouter.getParam('courseId'));
  },
});

