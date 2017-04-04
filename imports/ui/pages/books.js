import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { _ } from 'meteor/underscore';
// eslint-disable-next-line import/no-named-default
import { default as swal } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { Books } from '../../api/books.js';
import { Courses } from '../../api/courses.js';
import { Results } from '../../api/results.js';

Template.listBooks.helpers({
  books() {
    const courseId = FlowRouter.getParam('courseId');
    return Books.find({ course_id: courseId });
  },
});

Template.listBooks.events({
  'click .delete-course': function (event) {
    event.preventDefault();
    console.log('clicked');
    console.log(this);
    const id = Courses.findOne({ _id: this.courseId });
    console.log(id._id);
    const od = id._id;
    Courses.remove({ _id: od });
  },
  'click .delete-book': function (event) {
    event.preventDefault();
    const bookId = this._id;
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this book!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(function () {
      Books.remove(bookId);
      swal({
        title: 'Deleted!',
        text: 'Your book has been deleted.',
        type: 'success',
        showConfirmButton: false,
        timer: 2000,
      }).catch(swal.noop);
    }, function (dismiss) {
      // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      if (dismiss === 'cancel') {
        swal(
          'Cancelled',
          'Your book is safe :)',
          'error',
        );
      }
    });
  },
});

Template.showBook.events({
  // creating/editing results and checking them off in the database
  'click .chapter-status': function (event) {
    const chapterId = event.currentTarget.getAttribute('data-id');
    const bookId = this._id;

    const doc = Results.findOne({
      book_id: bookId,
      chapter_id: chapterId,
      user_id: Meteor.userId(),
    });
    if (!doc) {
      // Create new result
      console.log('Inserting', chapterId);
      Results.insert({
        chapter_id: chapterId,
        book_id: bookId,
        checked: true,
        // UserId is automatically set to current user
      });
    } else {
      // Result already in database
      console.log('Updating ', chapterId);
      Results.update(
        doc._id
      , {
        $set: {
          checked: !doc.checked,
        },
      });
    }
  },
});

Template.showBook.helpers({
  // Currently not used
  /* results() {
    return Results.find({
      // todo: get this from template/params
      book_id: 'ngCjAKza4DDQsjqyJ',
      user_id: Meteor.userId(),
    });
  },*/
  // Returns a count of the results in this book that have a checked: false status
  // Issue: does not include chapters that don't have a result in the Results collection
  uncheckedCount() {
    return Results.find({
      book_id: this._id,
      user_id: Meteor.userId(),
      checked: false,
    }).count();
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
});

Template.newBook.helpers({
  // Helper function for the new book form to specify collection
  getBooks() {
    return Books;
  },
});

// Routes "create book" and "edit book" forms to a specified template on success
AutoForm.addHooks(['createBook', 'updateBook'], {
  onSuccess() {
    FlowRouter.go('teacher.show');
  },
});
AutoForm.debug();

// Temporary fix for deleting array objects other than the last one on update
AutoForm.addHooks(null, {
  before: {
    update(doc) {
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
