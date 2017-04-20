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

Template.listBooks.helpers({
  books() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId });
  },
});

Template.listBooks.events({
  // show/hide chapters in book on click
  'click .book-preview': function toggleView(event) {
    const $this = $(event.currentTarget);
    const id = $this.data('id');
    console.log($this);
    console.log(id);
    $(`.book-slider[data-id="${id}"]`).slideToggle();
  },
  // confirmation popup on book deletion
  'click .delete-book': function confirmDelete(event) {
    event.preventDefault();
    const bookId = this._id;
    swal({
      title: 'Are you sure you want to delete this book?',
      text: 'You will not be able to recover it later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(function deleteBook() {
      Meteor.call('books.delete', bookId);
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

Template.listStudentBooks.events({
  'click .unfollow-course': function unfollowCourse(event) {
    event.preventDefault();
    const courseId = FlowRouter.getParam('courseId');
    Meteor.call('following.unfollow', courseId);
    FlowRouter.go('student.show');
  },
});

Template.listStudentBooks.helpers({
  hasBooks() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId }).count() > 0;
  },
  books() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId });
  },
});

Template.showBook.events({
  // create/edit results and set/toggle checked status in Results collection
  'click .chapter-status': function toggle(event) {
    const chapterId = event.currentTarget.getAttribute('data-id');
    const bookId = this._id;
    const courseId = this.course_id;
    Meteor.call('results.toggle', chapterId, bookId, courseId);

    // update progress bar
    Meteor.call('userStats', courseId, function stats(err, res) {
      // Use plot functon here with the data to insert graph in template
      $('#course-progress')
        .progress('set total', res.chapterCount) // maybe unnecessary?
        .progress('set progress', res.completedCount);
    });
  },
});

Template.showBook.helpers({
  // Returns a count of the results in this book that have a checked: false status
  // Issue: does not include chapters that don't have a result in the Results collection
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
      // todo: get this from template/params
      // done
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

Template.editBook.onRendered(function init() {
  $('input:checked').each(function indent() {
    const $this = $(this);
    const level = $this.val();
    console.log(level);
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
      },
      course_id: {
        type: String,
      },
    });
  },
});

// Routes "create book" and "edit book" forms to a specified template on success
AutoForm.addHooks(['createBook', 'createBookISBN'], {
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
