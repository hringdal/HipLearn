import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';
import { _ } from 'meteor/underscore';

import { Books } from '../../api/books.js';
import { Results } from '../../api/results.js';

Template.listBooks.helpers({
  books() {
    return Books.find({});
  },
});

Template.listBooks.events({
  'click .delete-book': function (event) {
    event.preventDefault();
    Books.remove(this._id);
  },
});

Template.showBook.events({
  'click .chapter-status': function (event) {
    const chapterId = event.currentTarget.getAttribute('data-id');
    console.log(event);
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
  // Temporary database cursor
  book() {
    return Books.findOne('ngCjAKza4DDQsjqyJ');
  },
  // Currently not used
  results() {
    return Results.find({
      // todo: get this from template/params
      book_id: 'ngCjAKza4DDQsjqyJ',
      user_id: Meteor.userId(),
    });
  },
  // Returns a count of the results in this book that have a checked: false status
  // Issue: does not include chapters that don't have a result in the Results collection
  uncheckedCount() {
    return Results.find({
      book_id: 'ngCjAKza4DDQsjqyJ',
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
      book_id: 'ngCjAKza4DDQsjqyJ',
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
    FlowRouter.go('books.index');
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
