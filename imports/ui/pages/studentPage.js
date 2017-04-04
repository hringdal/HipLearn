import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.studentPage.helpers({
  // fixes error with getting data before collection is ready
  authInProcess() {
    return Meteor.loggingIn();
  },
  selectedCourse() {
    console.log('selected course id: ', FlowRouter.getParam('courseId'));
    return FlowRouter.getParam('courseId');
  },
});

Template.studentPage.events({
  'click .test': function (event, instance) {
    instance.course.set(this._id);
  },
});
