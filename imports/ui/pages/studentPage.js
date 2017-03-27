import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';

import { Books } from '../../api/books.js';
import { Courses } from '../../api/courses.js';

Template.studentPage.onCreated(function init() {
  this.course = new ReactiveVar('hello!');
});

Template.studentPage.onRendered(function render() {
  $('.ui.sidebar')
    .sidebar({ context: $('.context') });
});

Template.studentPage.helpers({
  // return list of courses in current user document
  authInProcess() {
    return Meteor.loggingIn();
  },
  courses() {
    if (Meteor.user()) {
      const courseIds = Meteor.user().courses;
      return Courses.find({ _id: {
        $in: courseIds,
      } });
    }
    return ['hello'];
  },
  // change course based on reactivevar course
  selectedCourse() {
    const courseId = Template.instance().course.get();
    console.log(courseId);
    return Books.find({ course_id: courseId });
  },
  // todo: remove
  showCourse() {
    return Template.instance().course.get();
  },
  // # todo: list
  // 1. get list of course_ids from user
  // 2. get courses from database in course_id list
  // For each course in courses:
  //    - display course name, clickable
  //    - inherit data context to course template if possible
});

Template.studentPage.events({
  'click .test': function (event, instance) {
    instance.course.set(this._id);
  },
});
