import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { Books } from './books.js';

SimpleSchema.extendOptions(['autoform']);

const ResultSchema = new SimpleSchema({
  user_id: {
    type: String,
    optional: true,
    autoValue() {
      // return this.userId;
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return this.userId;
      }
      return undefined;
    },
  },
  course_id: {
    type: String,
  },
  book_id: {
    type: String,
  },
  chapter_id: {
    type: String,
  },
  checked: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
}, { tracker: Tracker });

export const Results = new Mongo.Collection('results');
Results.attachSchema(ResultSchema);

if (Meteor.isServer) {
  Meteor.publish('results.checked', function resultsCheckedPublication(bookId) {
    check(bookId, String);

    return Results.find({ book_id: bookId, user_id: this.userId });
  });
}

Meteor.methods({
  // Create a new result if none exists, or toggle the checked value of an existing result
  // @checked: optional argument for updating subchapters in the collection
  'results.toggle': function toggleResult(chapterId, bookId, courseId) {
    check(chapterId, String);
    check(bookId, String);
    check(courseId, String);

    function findChapter(chapter) {
      return chapter._id === chapterId;
    }

    const result = Results.findOne({
      book_id: bookId,
      chapter_id: chapterId,
      user_id: this.userId,
    });
    if (!result) {
      // Create new result
      console.log('Inserting', chapterId);
      Results.insert({
        chapter_id: chapterId,
        book_id: bookId,
        course_id: courseId,
        checked: true,
      });
      // UserId is automatically set to current user
    } else {
      // Result already in database
      console.log('Updating ', chapterId);
      Results.update(
        result._id
        , {
          $set: {
            checked: !result.checked,
          },
        });
    }
    try {
      const chapters = Books.findOne(bookId).chapters;
      const index = chapters.findIndex(findChapter);
      const parentResult = Results.findOne({
        book_id: bookId,
        chapter_id: chapterId,
        user_id: this.userId,
      });
      const chapterLevel = chapters[index].level;
      for (let i = index + 1; i < chapters.length; i += 1) {
        if (chapters[i].level <= chapterLevel) {
          break;
        }
        const subResult = Results.findOne({
          book_id: bookId,
          chapter_id: chapters[i]._id,
          user_id: this.userId,
        });
        if (!subResult) {
          // Create new result
          console.log('Inserting subresult', chapterId);
          Results.insert({
            chapter_id: chapters[i]._id,
            book_id: bookId,
            course_id: courseId,
            checked: parentResult.checked,
          });
          // UserId is automatically set to current user
        } else {
          // Result already in database
          console.log('Updating subresult', chapterId);
          Results.update(
            subResult._id
            , {
              $set: {
                checked: parentResult.checked,
              },
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
});
