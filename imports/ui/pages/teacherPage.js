import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { AutoForm } from 'meteor/aldeed:autoform';
import Highcharts from 'highcharts';
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


import { Courses } from '../../api/courses.js';
import { Following } from '../../api/following.js';

Template.teacherPage.helpers({
  courseSelected() {
    return Courses.findOne(FlowRouter.getParam('courseId'));
  },
});

Template.teacherPage.events({
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

Template.course.helpers({
  studentCount() {
    const courseId = FlowRouter.getParam('courseId');
    return Following.find({ course_id: courseId }).count();
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

Template.createCourse.onRendered(function init() {
  $('input[name="code"]').after('<div class="ui teal button" id="fill">Autofill</div><span data-tooltip="Use a valid code like TMA4100" data-position="right center"><i class="circular question icon"></i></span>');
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
    const courseCode = AutoForm.getFieldValue('code', 'createCourse');
    console.log(courseCode);
    // TODO: notify if course not found
    $('.ui.dimmer').addClass('active');
    Meteor.call('courseInfo', courseCode, '2016', function callback(err, res) {
      console.log(res);
      populate('#createCourse', res);
      $('.ui.dimmer').removeClass('active');
    });
  },
});

Template.pieChart.onRendered(function init() {
  this.autorun(function run() {
    $('#chart').highcharts({
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Completed chapters',
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      colors: ['lightblue', 'green'],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.0f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            },
          },
        },
      },
      series: [{
        name: 'Chapters',
        colorByPoint: true,
        data: [{
          name: 'Incomplete',
          y: 46,
        }, {
          name: 'Completed',
          y: 72,
        }],
      }],
    });
  });
});

AutoForm.addHooks('createCourse', {
  after: {
    method: function route(error, result) {
      FlowRouter.go('teacher.course', { courseId: result });
    },
  },
});

AutoForm.addHooks('updateCourse', {
  onSuccess() {
    const courseId = FlowRouter.getParam('courseId');
    FlowRouter.go('teacher.course', { courseId });
  },
});
