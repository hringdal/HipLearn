import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

import { Results } from './results.js';
import { Courses } from './courses.js';

SimpleSchema.extendOptions(['autoform']);

const BookSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Book title',
    autoform: {
      placeholder: 'Title',
    },
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

// Deny client-side updates because we use methods for handling data
Books.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  'books.insert': function insertBook(book) {
    check(book, Object);

    const ownerId = Courses.findOne(book.course_id).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('books.insert.accessDenied',
        'Cannot add books to a course that is not yours');
    }

    Books.insert(book);

    // Create a new notification
    const message = `A new book ${book.title} was added`;
    Meteor.call('notifications.create', message, book.course_id);
  },
  'books.insertISBN': function insertBookISBN(data) {
    check(data, {
      isbn: String,
      course_id: String,
    });

    const ownerId = Courses.findOne(data.course_id).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('books.insertISBN.accessDenied',
        'Cannot add books to a course that is not yours');
    }

    const isbn = data.isbn;
    const courseId = data.course_id;
    // Call the openlibrary api to get info about chapters in a book
    // There are few books that have a table_of_contents, but we often
    // get at least the title
    if (Meteor.isServer) {
      // remove all whitespace and set query
      const id = `ISBN:${isbn.replace(/\s/g, '')}`;

      try {
        const response = HTTP.call('GET', 'https://openlibrary.org/api/books', {
          params: {
            bibkeys: id, // AIMA ISBN: 9780136042594
            format: 'json',
            jscmd: 'details',
          },
        });
        const details = JSON.parse(response.content)[id].details;
        let chapters = [];
        let description = '';

        if (details.table_of_contents !== undefined) {
          chapters = details.table_of_contents;
          for (let i = 0; i < chapters.length; i += 1) {
            if (chapters[i].level < 1) {
              chapters[i].level = 1;
            } else if (chapters[i].level > 3) {
              chapters[i].level = 3;
            }
          }
        }

        if (details.description !== undefined) {
          description = details.description;
        }

        const book = {
          title: details.title,
          isbn,
          description,
          chapters,
          course_id: courseId,
        };
        Books.insert(book);
        return book.course_id;
      } catch (e) {
        // Got a network error, timeout, or HTTP error in the 400 or 500 range.
        // Or JSON parse error
        return false;
      }
    }
    return undefined;
  },

  'books.update': function updateBook(data) {
    check(data, Object);
    // check for permissions
    const courseId = Books.findOne(data._id).course_id;
    const ownerId = Courses.findOne(courseId).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('books.update.accessDenied',
        'Cannot update books in a course that is not yours');
    }

    Books.update(data._id, data.modifier);

    // get updated book and create a notification for following users
    const book = Books.findOne(data._id);
    const message = `The book ${book.title} was updated`;

    Meteor.call('notifications.create', message, book.course_id);

    // if chapter has been deleted, remove results
    // remove whole book if no chapters
    console.log(book.chapters);
    if (book.chapters === undefined) {
      Results.remove({ book_id: data._id });
    } else {
      console.log('else');
      const chapterIds = book.chapters.map(function getId(chapter) {
        return chapter._id;
      }); // compare results with chapters in book
      Results.remove({ book_id: data._id, chapter_id: { $nin: chapterIds } });
    }
  },
  'books.delete': function deleteBook(bookId) {
    check(bookId, String);

    const courseId = Books.findOne(bookId).course_id;
    const ownerId = Courses.findOne(courseId).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('books.delete.accessDenied',
        'Cannot delete books in a course that is not yours');
    }

    // remove related results
    Results.remove({ book_id: bookId });

    // get data and create a notification for following users
    const book = Books.findOne(bookId);
    const message = `The book ${book.title} was deleted`;
    Meteor.call('notifications.create', message, book.course_id);

    Books.remove(bookId);
  },
});
