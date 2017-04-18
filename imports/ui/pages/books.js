import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { ReactiveVar } from 'meteor/reactive-var';
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Books } from '../../api/books.js';
import { Courses } from '../../api/courses.js';
import { Results } from '../../api/results.js';

Template.listBooks.onCreated(function init() {
  this.showNewBook = new ReactiveVar(false);
});

Template.listBooks.helpers({
  books() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId });
  },
  course() {
    const courseId = FlowRouter.getParam('courseId');
    return Courses.findOne(courseId);
  },
  showNewBook() {
    return Template.instance().showNewBook.get();
  },
});

Template.listBooks.events({
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
  'click .show-new-book': function toggleView(event, instance) {
    const state = instance.showNewBook.get();
    instance.showNewBook.set(!state);
  },
  'click .delete-book': function confirmDelete(event) {
    event.preventDefault();
    const bookId = this._id;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this book!',
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

Template.listStudentBooks.onRendered(function () {
  Meteor.call('stats', function (err, res) {
    // Use plot functon here with the data to insert graph in template
    $('#course-progress')
      .progress({
        showActivity: false,
        total: res.chapterCount,
        value: res.completedCount,
        text: {
          active: 'Completed {value} of {total} chapters',
          success: 'All chapters completed! Good job!',
        },
      });
  });
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
  'click .chapter-status': function (event) {
    const chapterId = event.currentTarget.getAttribute('data-id');
    const bookId = this._id;
    const courseId = this.course_id;
    Meteor.call('results.toggle', chapterId, bookId, courseId);
    // TODO: muligens helt feil måte. Kan dette gjøres i metoden? Sjekk påfølgende kpt. i mongo
    /* const parent = event.currentTarget.parentElement;
    let parentLevel = parent.classList.item(1);
    parentLevel = parseInt(parentLevel.match(/[0-9]+/)[0], 10);
    $(parent).nextAll().each(function toggle() {
      if (parseInt((this.classList.item(1)).match(/[0-9]+/)[0], 10) > parentLevel) {
        const childChapterId = (this.children[0].getAttribute('data-id'));
        Meteor.call('results.toggle', childChapterId, bookId, courseId);
      } else {
        console.log('breaking');
        return false;
      }
    });*/
    // update progress bar
    Meteor.call('stats', function stats(err, res) {
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

Template.newBook.helpers({
  // Helper function for the new book form to specify collection
  getBooks() {
    return Books;
  },
});

// Routes "create book" and "edit book" forms to a specified template on success
AutoForm.addHooks('createBook', {
  before: {
    method(doc) {
      const book = doc;
      book.course_id = FlowRouter.getParam('courseId');
      return book;
    },
  },
  onSuccess() {
    this.template.parent(2).showNewBook.set(false);
    // TODO : Fix error
    window.scrollTo(0, 0);
  },
});

AutoForm.addHooks('updateBook', {
  onSuccess() {
    FlowRouter.go('teacher.course', { courseId: AutoForm.getFieldValue('course_id', 'updateBook') });
  },
});

AutoForm.debug();

// Fix for deleting array objects other than the last one on update
AutoForm.addHooks(null, {
  before: {
    'method-update': function methodUpdate(doc) {
      _.each(doc.$set, function (value, setter) {
        if (_.isArray(value)) {
          const newValue = _.compact(value);
          doc.$set[setter] = newValue;
        }
      });
      return doc;
    },
  },
});
