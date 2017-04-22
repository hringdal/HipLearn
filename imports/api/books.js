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
    label: 'Book title',
  },
  course_id: {
    type: String,
    label: 'Course ID',
    autoform: {
      type: 'hidden',
    },
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'Book description',
    },
  },
  isbn: {
    type: String,
    optional: true,
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
    label: 'Chapter Title',
    autoform: {
      placeholder: 'Title',
    },
  },
  'chapters.$.level': {
    type: Number,
    allowedValues: [1, 2, 3],
    label: 'Chapter type. Sections are connected to the nearest chapter above',
    autoform: {
      type: 'select-radio', options: [{ label: 'Chapter ( i )', value: 1 }, { label: 'Section ( i.i )', value: 2 }, { label: 'Subsection ( i.i.i )', value: 3 }],
    },
  },
}, { tracker: Tracker });

export const Books = new Mongo.Collection('books');
Books.attachSchema(BookSchema);

if (Meteor.isServer) {
  Meteor.publish('books', function booksPublication(courseId) {
    check(courseId, String);
    return Books.find({ course_id: courseId });
  });
  Meteor.publish('books.edit', function editBookPublication(bookId) {
    check(bookId, String);
    return Books.find({ _id: bookId });
  });
}

Meteor.methods({
  'books.insert': function insertBook(book) {
    check(book, Object);
    const bookId = Books.insert(book);

    // Create a new notification
    Meteor.call('notifications.create', bookId, 'added');
  },
  'books.insertISBN': function insertBookISBN(book) {
    check(book, Object);
    Meteor.call('bookInfo', book.isbn, book.course_id);
  },

  'books.update': function updateBook(data) {
    check(data, Object);
    // check for permissions
    Books.update(data._id, data.modifier);

    // get updated book
    const book = Books.findOne(data._id);

    // create a new notification
    Meteor.call('notifications.create', data._id, 'updated');

    // if chapter has been deleted, remove results
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
  bookInfo(isbn, courseId) {
    check(isbn, String);
    check(courseId, String);
    // Call the openlibrary api to get info about chapters in a book
    // There are few books that have a table_of_contents, but we often
    // get at least the title
    if (Meteor.isServer) {
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

        const book = {
          title: details.title,
          isbn,
          chapters: details.table_of_contents,  // TODO: change names inside here?
          course_id: courseId,
        };
        Meteor.call('books.insert', book);
      } catch (e) {
        // Got a network error, timeout, or HTTP error in the 400 or 500 range.
        // Or JSON parse error
        console.log(e);
        return false;
      }
    }
    return false;
  },
});
