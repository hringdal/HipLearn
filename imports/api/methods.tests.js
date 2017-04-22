/* eslint-env mocha */
/* eslint-disable func-names */

import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';

import { Books } from './books.js';
import { Courses } from './courses.js';
import { Following } from './following.js';
import { Results } from './results.js';

if (Meteor.isServer) {
  describe('Books', function () {
    describe('methods', function () {
      let userId;
      let bookId;

      beforeEach(function () {
        // clear
        Books.remove({});

        // create a book with a single chapter
        bookId = Books.insert({
          title: 'test book',
          course_id: 'test id',
          chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }],
        });

        // generate a user
        userId = Random.id();
      });

      describe('remove', function () {
        it('can delete owned book', function () {
          // get method
          const deleteBook = Meteor.server.method_handlers['books.delete'];

          // set invocation
          const invocation = { userId };

          // call method
          deleteBook.apply(invocation, [bookId]);

          // check that book has been deleted
          expect(Books.find().count()).to.equal(0);
        });
      });

      describe('insert', function () {
        it('can create a new book', function () {
          // get method
          const createBook = Meteor.server.method_handlers['books.insert'];

          // set invocation
          const invocation = { userId };

          // crete a book object
          const book = {
            title: 'test book 2',
            course_id: 'test id',
            chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }, { _id: 'test id 2', title: 'test chapter', level: 2 }],
          };

          // call method
          createBook.apply(invocation, [book]);

          // check that the new book has been inserted, and contains the correct data
          expect(Books.find().count()).to.equal(2);
          expect(Books.findOne({ title: 'test book 2' }).chapters).to.have.lengthOf(2);
        });
      });

      describe('update', function () {
        it('can update an existing book', function () {
          // get method
          const updateBook = Meteor.server.method_handlers['books.update'];

          // set invocation
          const invocation = { userId };

          // create a modifier for updating the book
          const modifier = { $set: { title: 'updated title' } };

          // set arguments
          const args = [{ _id: bookId, modifier }];

          // call method
          updateBook.apply(invocation, args);

          // check that title has been updated
          expect(Books.findOne(bookId).title).to.equal('updated title');
        });
      });

      describe('insertISBN', function () {
        it('can create a new book from ISBN code', function () {
          // get method
          const createBookISBN = Meteor.server.method_handlers['books.insertISBN'];

          // set invocation
          const invocation = { userId };

          // crete a ISBN book object
          const book = {
            isbn: '9780136042594',
            course_id: 'isbn id',
          };

          // call method
          createBookISBN.apply(invocation, [book]);

          // check that the new book has been inserted, and contains the correct data
          expect(Books.find().count()).to.equal(2);
          expect(Books.findOne({ isbn: '9780136042594' }).course_id).to.equal('isbn id');
        });
      });
    });
  });

  describe('Courses', function () {
    describe('methods', function () {
      let userId;
      let courseId;

      beforeEach(function () {
        // clear
        Courses.remove({});

        // generate a user
        userId = Random.id();

        // create a book with a single chapter
        courseId = Courses.insert({
          owner_id: userId,
          code: 'test code',
          name: 'test name',
        });
      });

      describe('remove', function () {
        it('can delete owned course', function () {
          // get method
          const deleteCourse = Meteor.server.method_handlers['courses.delete'];

          // set invocation
          const invocation = { userId };

          // call method
          deleteCourse.apply(invocation, [courseId]);

          // check that course has been deleted
          expect(Courses.find().count()).to.equal(0);
        });
      });

      describe('insert', function () {
        it('can create a new course', function () {
          // get method
          const createCourse = Meteor.server.method_handlers['courses.insert'];

          // set invocation
          const invocation = { userId };

          // crete a course object
          const course = {
            owner_id: userId,
            code: 'inserted course code',
            name: 'inserted course name',
          };

          // call method
          createCourse.apply(invocation, [course]);
          // check that the new course has been inserted
          expect(Courses.find().count()).to.equal(2);
        });
      });

      describe('update', function () {
        it('can update an existing course', function () {
          // get method
          const updateCourse = Meteor.server.method_handlers['courses.update'];

          // set invocation
          const invocation = { userId };

          // create a modifier for updating the course
          const modifier = { $set: { name: 'updated course name' } };

          // set arguments
          const args = [{ _id: courseId, modifier }];

          // call method
          updateCourse.apply(invocation, args);

          // check that name has been updated
          expect(Courses.findOne(courseId).name).to.equal('updated course name');
        });
      });
    });
  });

  describe('Following', function () {
    describe('methods', function () {
      let userId;
      let followingId;
      let courseId;

      beforeEach(function () {
        // clear
        Following.remove({});

        // generate a user
        userId = Random.id();

        // set a course id
        courseId = 'test course';

        // create a book with a single chapter
        followingId = Following.insert({
          user_id: userId,
          course_id: courseId,
        });
      });

      describe('unfollow', function () {
        it('can unfollow followed course', function () {
          // get method
          const unfollowCourse = Meteor.server.method_handlers['following.unfollow'];

          // set invocation
          const invocation = { userId };

          // call method
          unfollowCourse.apply(invocation, [courseId]);

          // check that following document has been deleted
          expect(Following.find().count()).to.equal(0);
        });
      });
    });
  });

  describe('Results', function () {
    describe('methods', function () {
      let userId;
      let chapterId;
      let bookId;
      let courseId;
      let resultId;

      beforeEach(function () {
        // clear
        Results.remove({});

        // generate a user
        userId = Random.id();

        // set test ids
        chapterId = 'test chapter';
        bookId = 'test book';
        courseId = 'test course';

        // create a result with a single chapter
        resultId = Results.insert({
          user_id: userId,
          chapter_id: chapterId,
          book_id: bookId,
          course_id: courseId,
          checked: true,
        });
      });

      describe('toggle', function () {
        it('can create a new result', function () {
          // get method
          const createResult = Meteor.server.method_handlers['results.toggle'];

          // set invocation
          const invocation = { userId };

          // set arguments
          const args = ['new chapter', bookId, courseId];
          // call method
          createResult.apply(invocation, args);

          // check that result h
          // as been added
          expect(Results.find().count()).to.equal(2);
        });

        it('can toggle an existing result', function () {
          // get method
          const toggleResult = Meteor.server.method_handlers['results.toggle'];

          // set invocation
          const invocation = { userId };

          // set arguments
          const args = [chapterId, bookId, courseId];
          // call method
          toggleResult.apply(invocation, args);

          // check that result h
          // as been added
          expect(Results.find().count()).to.equal(1);
          expect(Results.findOne(resultId).checked).to.equal(false);
        });
      });
    });
  });
}
