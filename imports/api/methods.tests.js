/* eslint-env mocha */
/* eslint-disable func-names, no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';

import { Books } from './books.js';
import { Courses } from './courses.js';
import { Following } from './following.js';
import { Results } from './results.js';
import { Notifications } from './notifications.js';

if (Meteor.isServer) {
  describe('Books', function () {
    describe('methods', function () {
      let userId;
      let courseId;
      let bookId;

      beforeEach(function () {
        // clear
        Books.remove({});
        Courses.remove({});

        // generate a user
        userId = Random.id();

        // create a reference course
        courseId = Courses.insert({
          owner_id: userId,
          code: 'CODE',
          name: 'test course',
        });

        // create a book with a single chapter
        bookId = Books.insert({
          title: 'test book',
          course_id: courseId,
          chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }],
        });
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
        it("cannot delete book user doesn't own", function () {
          // get method
          const deleteBook = Meteor.server.method_handlers['books.delete'];

          // set different userId
          userId = Random.id();

          // set invocation
          const invocation = { userId };

          // call method
          const fn = function () { deleteBook.apply(invocation, [bookId]); };
          expect(fn).to.throw(Error);

          // check that book still exists
          expect(Books.find().count()).to.equal(1);
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
            course_id: courseId,
            chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }, { _id: 'test id 2', title: 'test chapter', level: 2 }],
          };

          // call method
          createBook.apply(invocation, [book]);

          // check that the new book has been inserted, and contains the correct data
          expect(Books.find().count()).to.equal(2);
          expect(Books.findOne({ title: 'test book 2' }).chapters).to.have.lengthOf(2);
        });
        it('cannot create a book in a course user doesnt own', function () {
          // get method
          const createBook = Meteor.server.method_handlers['books.insert'];

          // set new user id
          userId = Random.id();

          // set invocation
          const invocation = { userId };


          // crete a book object
          const book = {
            title: 'test book 2',
            course_id: courseId,
            chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }, { _id: 'test id 2', title: 'test chapter', level: 2 }],
          };

          // call method and test for error
          const fn = function () { createBook.apply(invocation, [book]); };
          expect(fn).to.throw('books.insert.accessDenied');

          expect(Books.find().count()).to.equal(1);
        });
        it('cannot insert a book that lacks required fields', function () {
          // get method
          const createBook = Meteor.server.method_handlers['books.insert'];

          // set invocation
          const invocation = { userId };

          // crete a book object lacking title
          const book = {
            course_id: courseId,
            chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }, { _id: 'test id 2', title: 'test chapter', level: 2 }],
          };

          // expect method to fail
          expect(() => { createBook.apply(invocation, [book]); }).to.throw('Book title is required');
          expect(Books.find().count()).to.equal(1);
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
        it('cannot update a book in a course user doesnt own', function () {
          // get method
          const updateBook = Meteor.server.method_handlers['books.update'];

          // set new user id
          userId = Random.id();

          // set invocation
          const invocation = { userId };

          // create a modifier for updating the book
          const modifier = { $set: { title: 'updated title' } };

          // set arguments
          const args = [{ _id: bookId, modifier }];

          // call method and test for error
          const fn = function () { updateBook.apply(invocation, args); };
          expect(fn).to.throw('books.update.accessDenied');

          expect(Books.findOne(bookId).title).to.not.equal('updated title');
        });
        it('cannot update a book when required fields have been removed', function () {
          // get method
          const updateBook = Meteor.server.method_handlers['books.update'];

          // set invocation
          const invocation = { userId };

          // create a modifier for updating the book
          const modifier = { $set: { title: '' } };

          // set arguments
          const args = [{ _id: bookId, modifier }];

          // expect method to fail
          expect(() => { updateBook.apply(invocation, args); }).to.throw('Book title is required');
          expect(Books.findOne(bookId).title).to.equal('test book');
        });
      });

      describe('insertISBN', function () {
        it('can create a new book from ISBN code', function (done) {
          // get method
          const createBookISBN = Meteor.server.method_handlers['books.insertISBN'];

          // set invocation
          const invocation = { userId };

          // crete a ISBN data object
          const data = {
            isbn: '9780136042594',
            course_id: courseId,
          };

          // call method
          createBookISBN.apply(invocation, [data]);

          // check that the new book has been inserted, and contains the correct data
          // try except block handles the async method call, and waits until finished
          try {
            expect(Books.find().count()).to.equal(2);
            expect(Books.findOne({ isbn: '9780136042594' })).to.not.be.undefined;
          } catch (err) {
            done(err);
          }
          done();
        });
        it('cannot create a book in a course user doesnt own', function (done) {
          // get method
          const createBookISBN = Meteor.server.method_handlers['books.insertISBN'];

          // set new user id
          userId = Random.id();

          // set invocation
          const invocation = { userId };

          // create a ISBN data object
          const data = {
            isbn: '9780136042594',
            course_id: courseId,
          };

          // call method and test for error
          const fn = function () { createBookISBN.apply(invocation, [data]); };
          try {
            expect(Books.findOne({ isbn: '9780136042594' })).to.be.undefined;
            expect(fn).to.throw('books.insertISBN.accessDenied');
          } catch (err) {
            done(err);
          }
          done();
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
        Meteor.users.remove({});

        // generate a user
        userId = Random.id();
        Meteor.users.insert({ _id: userId, profile: { role: 2 } });

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
        it('cannot delete unowned course', function () {
          // get method
          const deleteCourse = Meteor.server.method_handlers['courses.delete'];

          // change userId
          userId = Random.id();

          // set invocation
          const invocation = { userId };

          // call method
          expect(() => { deleteCourse.apply(invocation, [courseId]); }).to.throw('courses.delete.accessDenied');
          expect(Courses.find().count()).to.equal(1);
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
          // expect(Courses.findOne({ code: 'inserted course code' })).to.not.be.undefined;
        });
        it('only works if you are a teacher', function () {
          // get method
          const createCourse = Meteor.server.method_handlers['courses.insert'];

          // set invocation
          const invocation = { userId };

          // set user to student
          Meteor.users.update(userId, { $set: { profile: { role: 1 } } });

          // crete a course object
          const course = {
            owner_id: userId,
            code: 'inserted course code',
            name: 'inserted course name',
          };

          expect(() => { createCourse.apply(invocation, [course]); }).to.throw('courses.insert.accessDenied');
          expect(Courses.find({}).count()).to.equal(1);
        });
        it('should not be able to create a course with a code that already exists', function () {
          // get method
          const createCourse = Meteor.server.method_handlers['courses.insert'];

          // set invocation
          const invocation = { userId };

          // crete a course object
          const course = {
            owner_id: userId,
            code: 'test code', // same as existing course in beforeEach function
            name: 'inserted course name',
          };

          // call method
          expect(() => { createCourse.apply(invocation, [course]); }).to.throw('duplicate key error');
          expect(Courses.find({}).count()).to.equal(1);
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
        it('cannot update a course that is not yours', function () {
          // get method
          const updateCourse = Meteor.server.method_handlers['courses.update'];

          // change to different userId
          userId = Random.id();

          // set invocation
          const invocation = { userId };

          // create a modifier for updating the course
          const modifier = { $set: { name: 'updated course name' } };

          // set arguments
          const args = [{ _id: courseId, modifier }];

          // call method and check for error
          expect(() => { updateCourse.apply(invocation, args); }).to.throw('courses.update.accessDenied');
          expect(Courses.findOne(courseId).name).to.not.equal('updated course name');
        });
      });
    });
  });

  describe('Following', function () {
    describe('methods', function () {
      let userId;
      let courseId;

      beforeEach(function () {
        // clear
        Following.remove({});

        // generate a user
        userId = Random.id();

        // set a course id
        courseId = 'test course';

        // create a book with a single chapter
        Following.insert({
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
        it('cannot unfollow a course user does not follow', function () {
          // get method
          const unfollowCourse = Meteor.server.method_handlers['following.unfollow'];

          // set invocation and args
          const invocation = { userId };
          courseId = 'new course id';

          // expect method call to fail
          expect(() => { unfollowCourse.apply(invocation, [courseId]); }).to.throw('following.unfollow.undefinedError');
          expect(Following.find().count()).to.equal(1);
        });
      });
      describe('follow', function () {
        it('can follow a new course', function () {
          // get method
          const followCourse = Meteor.server.method_handlers['following.follow'];

          // set new course id
          courseId = 'new course';

          // set invocation and args
          const invocation = { userId };
          const args = [{ _id: courseId }];

          // call method
          followCourse.apply(invocation, args);

          // check that following document has been created
          expect(Following.find().count()).to.equal(2);
          expect(Following.findOne({ course_id: 'new course' })).to.not.be.undefined;
        });
        it('cannot follow the same course twice', function () {
          // get method
          const followCourse = Meteor.server.method_handlers['following.follow'];

          // set invocation and args
          const invocation = { userId };
          const args = [{ _id: courseId }];

          // call method
          followCourse.apply(invocation, args);

          // check that duplicate doc has not been created
          expect(Following.find().count()).to.equal(1);
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
        it('must be logged in to create/toggle a result', function () {
          // get method
          const createResult = Meteor.server.method_handlers['results.toggle'];

          // set invocation with no user id
          const invocation = {};

          // set arguments
          const args = ['new chapter', bookId, courseId];

          // expect method to throw error
          expect(() => { createResult.apply(invocation, args); }).to.throw('results.toggle.notLoggedIn');
          expect(Results.find().count()).to.equal(1);
        });
      });
    });
  });

  describe('Notifications', function () {
    describe('methods', function () {
      let userId;
      let courseId;
      let notificationId;

      beforeEach(function () {
        // clear
        Notifications.remove({});
        Books.remove({});
        Courses.remove({});
        Following.remove({});

        // generate a user
        userId = Random.id();

        // create a test course
        courseId = Courses.insert({
          owner_id: 'teacher',
          code: 'test code',
          name: 'test name',
        });

        // create a book in given course
        Books.insert({
          title: 'test book',
          course_id: courseId,
          chapters: [{ _id: 'test id', title: 'test chapter', level: 1 }],
        });

        // follow the course for current user
        Following.insert({
          user_id: userId,
          course_id: courseId,
        });

        // create a notification for user in same course
        notificationId = Notifications.insert({
          user_id: userId,
          courseName: 'test name',
          course_id: courseId,
          seen: false,
          message: 'test message',
        });
      });

      describe('create', function () {
        it('can create a new notification', function () {
          // get method
          const createNotification = Meteor.server.method_handlers['notifications.create'];

          // set invocation
          const invocation = { userId };

          // set arguments
          const message = 'a new book was added';
          const args = [message, courseId];
          // call method
          createNotification.apply(invocation, args);

          // check that notification has been created
          expect(Notifications.find().count()).to.equal(2);
        });
      });
      describe('seen', function () {
        it('can set a notification status to "seen"', function () {
          // get method
          const seenNotification = Meteor.server.method_handlers['notifications.seen'];

          // set invocation
          const invocation = { userId };

          // call method
          seenNotification.apply(invocation, [notificationId]);

          // check that following document has been deleted
          expect(Notifications.findOne(notificationId).seen).to.equal(true);
        });
      });
      describe('clear', function () {
        it('can clear all notifications for a user', function () {
          // get method
          const clearNotifications = Meteor.server.method_handlers['notifications.clear'];

          // create a second unseen notification
          Notifications.insert({
            user_id: userId,
            courseName: 'test name',
            course_id: courseId,
            seen: false,
            message: 'test message 2',
          });

          // set invocation
          const invocation = { userId };

          // call method
          clearNotifications.apply(invocation);

          // check that all notifications are set to seen
          expect(Notifications.find({ user_id: userId }).count()).to.equal(2);
          expect(Notifications.find({ user_id: userId, seen: false }).count()).to.equal(0);
        });
      });
    });
  });
}
