import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';

import { Courses } from '../../api/courses.js';

Template.teacherPage.onCreated(function init() {
  this.course = new ReactiveVar(false);
});

Template.teacherPage.onRendered(function render() {
  $('.ui.sidebar')
    .sidebar({ context: $('.context') });
  $('#teacher')
    .modal('attach events', '#clickable2', 'show');
});

Template.teacherPage.helpers({
  // fixes error with getting data before collection is ready
  authInProcess() {
    return Meteor.loggingIn();
  }, // return list of courses in current user document
  courses() {
    if (Meteor.user()) {
      return Courses.find({ owner_id: Meteor.userId() }, { sort: { name: 1 } });
    }
    return ['No courses'];
  }, // change course based on reactivevar course
  selectedCourse() {
    return Template.instance().course.get();
  },
  getCourses() {
    return Courses;
  },

});

Template.teacherPage.events({
  'click .test': function (event, instance) {
    instance.course.set(this._id);
  },
});
