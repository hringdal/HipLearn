import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';

import { Books } from '../../api/books.js';
import { Courses, PlayersIndex } from '../../api/courses.js';

Template.studentPage.onCreated(function init() {
  this.course = new ReactiveVar(false);
});

Template.studentPage.onRendered(function render() {
  $('.ui.sidebar')
    .sidebar({ context: $('.context') });
});

Template.studentPage.helpers({
  // fixes error with getting data before collection is ready
  authInProcess() {
    return Meteor.loggingIn();
  },
  // return list of courses in current user document
  courses() {
    if (Meteor.user()) {
      const courseIds = Meteor.user().courses;
      return Courses.find({ _id: {
        $in: courseIds,
      } });
    }
    return ['No courses'];
  },
  // change course based on reactivevar course
  selectedCourse() {
    const courseId = Template.instance().course.get();
    console.log(courseId);
    return Books.find({ course_id: courseId });
  },
  playersIndex: () => PlayersIndex,
});

Template.studentPage.events({
  'click .test': function (event, instance) {
    instance.course.set(this._id);
  },
});
