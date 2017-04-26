import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { AutoForm } from 'meteor/aldeed:autoform';
// eslint-disable-next-line no-unused-vars
import Highcharts from 'highcharts'; // import is actually used, but by jquery
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Courses } from '../../api/courses.js';
import { Books } from '../../api/books.js';
import { Following } from '../../api/following.js';

Template.teacherPage.onCreated(function created() {
  this.autorun(() => {
    this.subscribe('courses.teacher');
  });
});

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

Template.course.onCreated(function created() {
  this.getCourseId = () => FlowRouter.getParam('courseId');

  this.autorun(() => {
    this.subscribe('books', this.getCourseId());
    this.subscribe('following.count', this.getCourseId());
  });
});

Template.course.helpers({
  studentCount() {
    if (Meteor.user()) {
      return Following.find({ course_id: FlowRouter.getParam('courseId'), user_id: { $ne: Meteor.userId() } }).count();
    }
    return 0;
  },
  courseHasNoBooks() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId }).count() === 0;
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
  $('input[name="code"]').parent().after('<div class="ui teal button" style="margin-bottom: 1em" id="fill">Autofill Form</div><span data-tooltip="Be aware that NTNU does not have descriptions and learning goals for every course" data-position="right center"><i class="circular question icon"></i></span>');
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

    $('.submit-loader.ui.dimmer').addClass('active');

    Meteor.call('courseInfo', courseCode, '2016', function callback(err, res) {
      populate('#createCourse', res);
      $('.ui.dimmer').removeClass('active');
    });
  },
});

Template.pieCharts.onRendered(function init() {
  const courseId = FlowRouter.getParam('courseId');
  this.autorun(function run() {
    $('#teacherChart').highcharts({
      chart: {
        style: { fontFamily: 'Roboto, Sans-serif', color: '#aeafb1' },
      },
      title: {
        style: { background: '#fafafa', color: '#767676' },
        text: '<b>0</b><br>Total chapters',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: { enabled: false },
          colors: ['#54C8FF', '#2ECC40'],
          center: ['50%', '50%'],
          point: {
            events: {
              legendItemClick() {
                return false;
              },
            },
          },
        },
      },
      series: [{
        type: 'pie',
        name: 'Chapters',
        innerSize: '70%',
        data: [
          {
            name: 'Incomplete',
            y: 0,
          },
          {
            name: 'Completed',
            y: 0,
          },
        ],
      }],
      credits: {
        enabled: false,
      },
    });

    $('#studentChart').highcharts({
      chart: {
        style: { fontFamily: 'Roboto, Sans-serif', color: '#aeafb1' },
      },
      title: {
        style: { color: '#767676' },
        text: '<b>0</b><br>Total chapters',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: 'pointer',
          dataLabels: { enabled: false },
          colors: ['#54C8FF', '#2ECC40'],
          center: ['50%', '50%'],
          point: {
            events: {
              legendItemClick() {
                return false;
              },
            },
          },
        },
      },
      series: [{
        type: 'pie',
        name: 'Chapters',
        innerSize: '70%',
        data: [
          {
            name: 'Incomplete',
            y: 0,
          },
          {
            name: 'Completed',
            y: 0,
          },
        ],
      }],
      credits: {
        enabled: false,
      },
    });
  });
  Meteor.call('userStats', courseId, Meteor.userId(), function userStats(err, res) {
    // Use plot functon here with the data to insert graph in template
    const $teacherChart = $('#teacherChart');
    $teacherChart.highcharts().series[0].setData([
      res.chapterCount - res.completedCount,
      res.completedCount]);
    $teacherChart.highcharts().setTitle({ text: `<b>${res.completedCount}</b><br>Completed<br>chapters` });
  });
  Meteor.call('averageUserStats', courseId, function averageStats(err, res) {
    const $studentChart = $('#studentChart');
    $studentChart.highcharts().series[0].setData([
      res.chapterCount - res.averageCount,
      res.averageCount,
    ]);
    $studentChart.highcharts().setTitle({ text: `<b>${res.averageCount}</b><br>Completed<br>chapters` });
  });
});

AutoForm.addHooks('createCourse', {
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
