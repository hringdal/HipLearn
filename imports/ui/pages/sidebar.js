import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { $ } from 'meteor/jquery';

import { Courses, AddCourseSchema } from '../../api/courses.js';
import { Following } from '../../api/following.js';

Template.teacherSidebar.onRendered(function render() {
  $('#teacher')
    .modal('attach events', '#clickable2', 'show');
});

Template.studentSidebar.onRendered(function render() {
  $('#student')
    .modal('attach events', '#clickable', 'show');
});

Template.studentSidebar.helpers({
  // return list of courses current user is following
  courses() {
    if (!Meteor.user()) {
      return undefined;
    }
    const courseIds = Following.find({ user_id: Meteor.userId() }).map(function (c) {
      return c.course_id;
    });
    console.log(courseIds);
    return Courses.find({ _id: { $in: courseIds } }, { sort: { name: 1 } });
  },
  addCourseSchema() {
    return AddCourseSchema;
  },
  pathForCourse() {
    const course = this;
    const id = course._id;
    const params = { courseId: id };
    return FlowRouter.path('student.course', params);
  },
  activeCourse() {
    return FlowRouter.getParam('courseId') === this._id;
  },
});

Template.teacherSidebar.helpers({
  // return list of courses in current user document
  courses() {
    if (Meteor.user()) {
      return Courses.find({ owner_id: Meteor.userId() }, { sort: { name: 1 } });
    }
    return undefined;
  },
  formCourses() {
    return Courses;
  },
  pathForCourse() {
    const course = this;
    const id = course._id;
    const params = { courseId: id };
    return FlowRouter.path('teacher.course', params);
  },
  activeCourse() {
    return FlowRouter.getParam('courseId') === this._id;
  },
});

AutoForm.addHooks('addForm', {
  onSuccess() {
    const courseId = AutoForm.getFieldValue('_id', 'addForm');
    FlowRouter.go('student.course', { courseId });
  },
});
