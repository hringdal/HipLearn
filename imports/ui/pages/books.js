import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import SimpleSchema from 'simpl-schema';
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Books } from '../../api/books.js';
import { Results } from '../../api/results.js';
import { Courses } from '../../api/courses.js';

import './books.html';

Template.listBooks.onCreated(function created() {
  this.autorun(() => {
    this.getCourseId = () => FlowRouter.getParam('courseId');

    this.subscribe('books', this.getCourseId());
  });
});

Template.listBooks.helpers({
  books() {
    return Books.find({});
  },
});

Template.listBooks.events({
  // show/hide chapters in book on click
  'click .book-preview': function toggleView(event) {
    const $this = $(event.currentTarget);
    const id = $this.data('id');
    $(`.book-slider[data-id="${id}"]`).slideToggle();
    $(`.book-preview.button[data-id="${id}"]`).text(function toggleText(i, text) {
      return text === 'Show' ? 'Hide' : 'Show';
    });
  },
  // confirmation popup on book deletion
  'click .delete-book': function confirmDelete(event) {
    event.preventDefault();
    const bookId = this._id;
    const courseId = this.course_id;
    swal({
      title: 'Are you sure you want to delete this book?',
      text: 'You will not be able to recover it later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(function deleteBook() {
      Meteor.call('books.delete', bookId);

      // update charts
      Meteor.call('userStats', courseId, Meteor.userId(), function userStats(err, res) {
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
      swal({
        title: 'Deleted!',
        text: 'Your book has been deleted.',
        type: 'success',
        showConfirmButton: false,
        timer: 2000,
      }).catch(swal.noop);
    }, function cancel(dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
        swal(
          'Cancelled',
          'Your book is safe :)',
          'error',
        ).catch(swal.noop);
      }
    });
  },
});

Template.listStudentBooks.onCreated(function created() {
  this.getCourseId = () => FlowRouter.getParam('courseId');
  this.getOwnerId = () => Template.instance().data.owner_id;

  this.autorun(() => {
    this.subscribe('books', this.getCourseId());
  });
});

Template.listStudentBooks.onRendered(function init() {
  // this subscription has to wait for a value that is rendered in template
  this.subscribe('users.owner', this.getOwnerId());
  $('#course-info').accordion('open', 0);
});

Template.listStudentBooks.helpers({
  books() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId });
  },
  courseOwner() {
    const ownerId = Template.instance().data.owner_id;
    const owner = Meteor.users.findOne(ownerId);
    return owner.emails[0].address;
  },
  isStudent() {
    if (!Meteor.user()) {
      return false;
    }
    return Meteor.user().profile.role === 1;
  },
});

Template.listStudentBooks.events({
  'click .unfollow-course': function unfollowCourse(event) {
    event.preventDefault();
    const courseId = FlowRouter.getParam('courseId');
    Meteor.call('following.unfollow', courseId);
    FlowRouter.go('student.show');
  },
});

Template.progressBar.onRendered(function init() {
  this.autorun(function render() {
    const courseId = FlowRouter.getParam('courseId');
    if (typeof courseId !== 'undefined') { // make sure that a course is selected
      Meteor.call('userStats', courseId, Meteor.userId(), function updateProgress(err, res) {
        // Use plot functon here with the data to insert graph in template
        $('#course-progress')
          .progress({
            showActivity: false,
            total: res.chapterCount,
            value: res.completedCount,
            text: {
              active: 'Completed {value} of {total} total chapters',
              success: 'All chapters completed! Good job!',
            },
          });
      });

      Meteor.call('userStats', courseId, Template.parentData(0).owner_id, function updateProgress(err, res) {
        // Use plot functon here with the data to insert graph in template
        $('#expected-progress')
          .progress({
            showActivity: false,
            total: res.chapterCount,
            value: res.completedCount,
            text: {
              active: 'Completed {value} of {total} total chapters',
              success: 'All chapters should be completed!',
            },
          });
      });
    }
  });
});

Template.showBook.onCreated(function created() {
  this.getBookId = () => this.data._id;

  this.autorun(() => {
    this.subscribe('results.checked', this.getBookId());
  });
});

Template.showBook.helpers({
  // Returns a count of the results in this book that have a checked: false status
  uncheckedCount() {
    const book = this;
    if (typeof book.chapters === 'undefined') {
      // no chapters in selected book
      return 0;
    }
    const count = book.chapters.length;
    const checked = Results.find({
      book_id: book._id,
      user_id: Meteor.userId(),
      checked: true,
    }).count();
    return count - checked;
  },
  // Function for checking checked results in the database
  checked(chapterId) {
    // loop through results to find a chapter with the same id
    // if it exists, change values
    const result = Results.findOne({
      book_id: this._id,
      user_id: Meteor.userId(),
      chapter_id: chapterId,
    });
    if (result) {
      return result.checked;
    }
    return false;
  },
});

Template.showBook.events({
  // create/edit results and set/toggle checked status in Results collection
  'click .chapter-status': function toggle(event) {
    const chapterId = event.currentTarget.getAttribute('data-id');
    const bookId = this._id;
    const courseId = this.course_id;
    Meteor.call('results.toggle', chapterId, bookId, courseId);

    // update progress bar if in student page
    if (FlowRouter.getRouteName() === 'student.course') {
      Meteor.call('userStats', courseId, Meteor.userId(), function stats(err, res) {
        // Use plot functon here with the data to insert graph in template
        const $progress = $('#course-progress');
        if (res.completedCount === res.chapterCount) {
          $progress
            .progress('set success');
        } else {
          $progress
            .progress('set total', res.chapterCount)
            .progress('set progress', res.completedCount);
        }
      });

      if (Meteor.userId() === Template.parentData(1).owner_id) {
        Meteor.call('userStats', courseId, Meteor.userId(), function updateProgress(err, res) {
          const $progress = $('#expected-progress');
          if (res.completedCount === res.chapterCount) {
            $progress
              .progress('set success');
          } else {
            $progress
              .progress('set total', res.chapterCount)
              .progress('set progress', res.completedCount);
          }
        });
      }
    }

    // update charts if teacher page
    if (FlowRouter.getRouteName() === 'teacher.course') {
      Meteor.call('userStats', courseId, Meteor.userId(), function userStats(err, res) {
        const $teacherChart = $('#teacherChart');
        $teacherChart.highcharts().series[0].setData([
          res.chapterCount - res.completedCount,
          res.completedCount,
        ]);
        $teacherChart.highcharts().setTitle({ text: `<b>${res.completedCount}</b><br>Completed<br>chapters` });
      });
      Meteor.call('averageUserStats', courseId, function userStats(err, res) {
        const $studentChart = $('#studentChart');
        $studentChart.highcharts().series[0].setData([
          res.chapterCount - res.averageCount,
          res.averageCount,
        ]);
        $studentChart.highcharts().setTitle({ text: `<b>${res.averageCount}</b><br>Completed<br>chapters` });
      });
    }
  },
});

Template.editBook.onCreated(function created() {
  this.getBookId = () => FlowRouter.getParam('_id');

  this.autorun(() => {
    this.subscribe('books.edit', this.getBookId());
  });
});

Template.editBook.onRendered(function init() {
  $('input:checked').each(function indent() {
    const $this = $(this);
    const level = $this.val();
    $this.parents('.autoform-array-item:first').addClass(`level-${level}`);
  });
});

Template.editBook.helpers({
  // Helper function for the edit form to specify collection
  getBooks() {
    return Books;
  },
  // returns a book with the address parameter _id
  getBook() {
    const id = FlowRouter.getParam('_id');
    return Books.findOne(id);
  },
  pathForCourse() {
    const courseId = AutoForm.getFieldValue('course_id', 'updateBook');
    return FlowRouter.path('teacher.course', { courseId });
  },
});

Template.editBook.events({
  'change input:radio': function indent(event) {
    const $this = $(event.target);
    const level = $this.val();
    $this.parents('.autoform-array-item').removeClass('level-2 level-3').addClass(`level-${level}`);
  },
});

Template.newBook.onRendered(function init() {
  window.scrollTo(0, 0);
});

Template.newBook.helpers({
  // Helper function for the new book form to specify collection
  getBooks() {
    return Books;
  },
  // path for returning to the course page
  pathForCourse() {
    const courseId = FlowRouter.getParam('courseId');
    return FlowRouter.path('teacher.course', { courseId });
  },
  // display selected course code in form
  getCourseCode() {
    const course = Courses.findOne({ _id: FlowRouter.getParam('courseId') }, { fields: { code: 1 } });
    return course.code;
  },
});

Template.newBook.events({
  // indent chapter based on value of selected radio in the form
  'change input:radio': function indent(event) {
    const $this = $(event.target);
    const level = $this.val();
    $this.parents('.autoform-array-item').removeClass('level-2 level-3').addClass(`level-${level}`);
  },
});

Template.newBookISBN.helpers({
  // Helper function for the new book form to specify collection
  getBooks() {
    return Books;
  },
  pathForCourse() {
    const courseId = FlowRouter.getParam('courseId');
    return FlowRouter.path('teacher.course', { courseId });
  },
  isbnSchema() {
    return new SimpleSchema({
      isbn: {
        type: String,
        label: 'ISBN code',
      },
      course_id: {
        type: String,
      },
    });
  },
});

// Routes "create book" and "edit book" forms to a specified template on success
AutoForm.addHooks(['createBook'], {
  before: {
    // Add courseId to book document before insert
    method(doc) {
      const book = doc;
      book.course_id = FlowRouter.getParam('courseId');
      return book;
    },
  },
  // Route to course on successful book creation
  onSuccess() {
    const courseId = FlowRouter.getParam('courseId');
    FlowRouter.go('teacher.course', { courseId });
  },
});

AutoForm.addHooks('createBookISBN', {
  before: {
    // Add courseId to book document before insert
    method(doc) {
      if ($('input[type="text"]').val() !== '') {
        $('.submit-loader.ui.dimmer').addClass('active');
      }
      const book = doc;
      book.course_id = FlowRouter.getParam('courseId');
      return book;
    },
  },
  after: {
    method: function res(error, result) {
      if (result) {
        swal({
          title: 'Success!',
          text: 'A new book was created. Returning to course..',
          type: 'success',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {}, function route() {
          FlowRouter.go('teacher.course', { courseId: result });
        }).catch(swal.noop);
      } else {
        $('.submit-loader.ui.dimmer').removeClass('active');
        swal('Getting info from Open Library failed...', "We couldn't find a book with that ISBN, or the book is missing required information", 'error');
      }
    },
  },
});

AutoForm.addHooks('updateBook', {
  // Route to course on successful book update
  onSuccess() {
    FlowRouter.go('teacher.course', { courseId: AutoForm.getFieldValue('course_id', 'updateBook') });
  },
});

// Fix for deleting array objects other than the last one on update
AutoForm.addHooks(null, {
  before: {
    'method-update': function methodUpdate(doc) {
      const document = doc;
      _.each(document.$set, function removeNull(value, setter) {
        if (_.isArray(value)) {
          document.$set[setter] = _.compact(value);
        }
      });
      return doc;
    },
  },
});
// TODO: remove
AutoForm.debug();
