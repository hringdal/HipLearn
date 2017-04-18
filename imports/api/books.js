import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

import { Results } from './results.js';

SimpleSchema.extendOptions(['autoform']);

const BookSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
  },
  course_id: {
    type: String,
    label: 'Course ID',
    autoform: {
      type: 'hidden',
    },
  },
  chapters: {
    type: Array,
    label: 'Chapters',
    optional: true,
  },
  'chapters.$': {
    type: Object,
    label: 'Chapter',
  },
  'chapters.$._id': {
    type: String,
    optional: true,
    autoValue() {
      // might be a problem
      // deleting books in the array on edit gives an UpdateError
      if (this.isSet) {
        return this.value;
      }
      return Random.id();
    },
    autoform: {
      type: 'hidden',
    },
  },
  'chapters.$.title': {
    type: String,
    label: 'Chapter',
    autoform: {
      placeholder: 'Chapter title',
    },
  },
  'chapters.$.level': {
    type: Number,
    allowedValues: [1, 2, 3],
    label: 'Chapter level ( 1 means a main chapter )',
    autoform: {
      type: 'select-radio', options: [{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 },],
    },
  },
}, { tracker: Tracker });

export const Books = new Mongo.Collection('books');
Books.attachSchema(BookSchema);

if (Meteor.isServer) {
  Meteor.publish('books', function booksPublication() {
    return Books.find();
  });
}

Meteor.methods({
  'books.insert': function insertBook(book) {
    Books.insert(book);
  },
  'books.update': function updateBook(data) {
    // check for permissions
    Books.update(data._id, data.modifier);
    // if chapter has been deleted, remove results
    const book = Books.findOne(data._id);
    const chapterIds = book.chapters.map(function getId(chapter) {
      return chapter._id;
    }); // compare results with chapters in book
    Results.remove({ book_id: data._id, chapter_id: { $nin: chapterIds } });
  },
  'books.delete': function deleteBook(bookId) {
    check(bookId, String);
    Results.remove({ book_id: bookId });
    Books.remove(bookId);
  },
  bookInfo(isbn) {
    check(isbn, String);
    // Call the openlibrary api to get info about chapters in a book
    // There are few books that have a table_of_contents, but we often
    // get at least the title

    this.unblock();
    const id = `ISBN:${isbn}`;

    try {
      const response = HTTP.call('GET', 'https://openlibrary.org/api/books', {
        params: {
          bibkeys: id, // AIMA ISBN: 9780136042594
          format: 'json',
          jscmd: 'details',
        },
      });

      const details = JSON.parse(response.content)[id].details;

      return {
        title: details.title,
        isbn,
        chapters: details.table_of_contents,  // TODO: change names inside here?
      };
    } catch (e) {
      // Got a network error, timeout, or HTTP error in the 400 or 500 range.
      // Or JSON parse error
      console.log(e);
      return false;
    }
  },
});
