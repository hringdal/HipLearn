import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { AutoForm } from 'meteor/aldeed:autoform';
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Chart from 'chart.js';

import { Courses } from '../../api/courses.js';
import { Following } from '../../api/following.js';

Template.teacherPage2.helpers({
  courseSelected() {
    return Courses.findOne(FlowRouter.getParam('courseId'));
  },
  studentCount() {
    const courseId = FlowRouter.getParam('courseId');
    return Following.find({ course_id: courseId }).count();
  },
});

Template.teacherPage2.events({
  'click .delete-course': function confirmDelete(event) {
    event.preventDefault();
    const courseId = FlowRouter.getParam('courseId');
    swal({
      title: 'Are you sure?',
      text: 'This course will be deleted forever!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(function deleteCourse() {
      Meteor.call('courses.delete', courseId);
      swal({
        title: 'Deleted!',
        text: 'Your course has been deleted.',
        type: 'success',
        showConfirmButton: false,
        timer: 2000,
      }).catch(swal.noop);
      FlowRouter.go('teacher.show');
    }).catch(swal.noop);
  },
});

Template.editCourse.helpers({
  courses() {
    return Courses;
  },
  getCourse() {
    const courseId = FlowRouter.getParam('courseId');
    return Courses.findOne(courseId);
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
    const courseCode = AutoForm.getFieldValue('code', 'createCourseForm');
    console.log(courseCode);
    // TODO: notify if course not found
    $('.ui.dimmer').addClass('active');
    Meteor.call('courseInfo', courseCode, '2016', function callback(err, res) {
      console.log(res);
      populate('#createCourseForm', res);
      $('.ui.dimmer').removeClass('active');
    });
  },
});

Template.pieChart.onRendered(function init() {
  console.log('rendered chart');
  const data = {
    labels: [
      'Incomplete',
      'Completed',
    ],
    datasets: [
      {
        data: [72, 51],
        backgroundColor: [
          '#767676',
          '#21BA45',
        ],
        hoverBackgroundColor: [
          '#989898',
          '#2ECC40',
        ],
      }],
  };
  const options = {
    legend: {
      onClick: event => event.stopPropagation(),
    },
  };

  const ctx = document.getElementById('chart1').getContext('2d');
  const chart1 = new Chart(ctx, {
    type: 'pie',
    data,
    options,
  });
});

AutoForm.addHooks('createCourseForm', {
  onSuccess(formType, result) {
    FlowRouter.go('teacher.course', { courseId: result });
  },
});

AutoForm.addHooks('updateCourse', {
  onSuccess() {
    const courseId = FlowRouter.getParam('courseId');
    FlowRouter.go('teacher.course', { courseId });
  },
});
