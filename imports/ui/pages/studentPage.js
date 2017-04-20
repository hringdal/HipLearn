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

Template.progressBar.onRendered(function init() {
  this.autorun(function render() {
    const courseId = FlowRouter.getParam('courseId');
    if (typeof courseId !== 'undefined') { // make sure that a course is selected
      Meteor.call('userStats', courseId, function updateProgress(err, res) {
        // Use plot functon here with the data to insert graph in template
        $('#course-progress')
          .progress({
            showActivity: false,
            total: res.chapterCount,
            value: res.completedCount,
            text: {
              active: 'Completed {value} of {total} chapters',
              success: 'All chapters completed! Good job!',
            },
          });
      });
      Meteor.call('averageUserStats', courseId, function avg(err, res) {
        // Use plot functon here with the data to insert graph in template
        console.log(res);
      });
    }
  });
});
