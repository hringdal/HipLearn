import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { $ } from 'meteor/jquery';

import { Courses, AddCourseSchema } from '../../api/courses.js';
import { Following } from '../../api/following.js';

Template.studentSidebar.onCreated(function created() {
  this.autorun(() => {
    this.subscribe('courses.student');
    this.subscribe('following');
  });
});

Template.studentSidebar.onRendered(function render() {
  $('#student')
    .modal('attach events', '#clickable', 'show');
});

Template.studentSidebar.helpers({
  // return list of courses current user is following
  courses() {
    const courseIds = Following.find({ user_id: Meteor.userId() }).map(function createList(c) {
      return c.course_id;
    });
    return Courses.find({ _id: { $in: courseIds } }, { sort: { code: 1 } });
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
  isTeacher() {
    if (!Meteor.user()) {
      return false;
    }
    return Meteor.user().profile.role === 2;
  },
});

Template.studentSidebar.events({
  'click a.item': function scrollTop() {
    window.scrollTo(0, 0);
  },
});

Template.followCourseModal.helpers({
  addCourseSchema() {
    return AddCourseSchema;
  },
});

Template.teacherSidebar.onCreated(function created() {
  this.autorun(() => {
    this.subscribe('courses.teacher');
  });
});

Template.teacherSidebar.helpers({
  // return list of courses in current user document
  courses() {
    if (Meteor.user()) {
      return Courses.find({ owner_id: Meteor.userId() }, { sort: { code: 1 } });
    }
    return undefined;
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

Template.teacherSidebar.events({
  'click a.item': function scrollTop() {
    window.scrollTo(0, 0);
  },
});

AutoForm.addHooks('followCourse', {
  onSuccess() {
    const courseId = AutoForm.getFieldValue('_id', 'followCourse');
    FlowRouter.go('student.course', { courseId });
  },
});
