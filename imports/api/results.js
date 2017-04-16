import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

SimpleSchema.extendOptions(['autoform']);

const ResultSchema = new SimpleSchema({
  user_id: {
    type: String,
    autoValue() {
      return this.userId;
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

Meteor.methods({
  // Create a new result if none exists, or toggle the checked value of an existing result
  'results.toggle': function toggleResult(chapterId, bookId, courseId) {
    check(chapterId, String);
    check(bookId, String);
    check(courseId, String);
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
  },
});
