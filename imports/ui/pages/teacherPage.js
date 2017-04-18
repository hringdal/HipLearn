import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { AutoForm } from 'meteor/aldeed:autoform';

import { Courses } from '../../api/courses.js';

Template.teacherPage2.helpers({
  course() {
    return Courses.findOne(FlowRouter.getParam('courseId'));
  },
});

Template.createCourse.helpers({
  formCourses() {
    return Courses;
  },
});

Template.createCourse.events({
  'click #fill': function fillForm() {
    function populate(frm, data) {
      $.each(data, function fill(key, value) {
        $(`[name=${key}]`, frm).val(value);
      });
    }
    const courseCode = AutoForm.getFieldValue('code', 'createForm');
    console.log(courseCode);
    // TODO: notify if course not found
    Meteor.call('courseInfo', courseCode, '2016', function (err, res) {
      console.log(res);
      populate('#createForm', res);
    });
  },
});
