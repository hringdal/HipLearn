import { Meteor } from 'meteor/meteor';
import { Books } from './books.js';
import { Results } from './results.js';

const chaptersInCourse = function chaptersInCourse(courseId) {
  const pipeline = [
    {  // Create a separate document for each chapter
      $unwind: '$chapters',
    },
    { // Comment out this pair of braces to include all books
      $match: { course_id: courseId },
    },
    {
      $group: {
        _id: '$course_id',  // Set to null to aggregate over all books,
        // Set to course_id to aggregate over course id
        count: { $sum: 1 },
      },
    },
  ];
  return Books.aggregate(pipeline);
};

const chaptersCompletedByUser = function chaptersCompletedByUser(courseId, userId) {
  const pipeline = [
    { // Comment out this pair of braces to include all books
      $match: { course_id: courseId, user_id: userId, checked: true },
    },
    {
      $group: {
        _id: null,  // Set to null to aggregate over all books,
        // Set to course_id to aggregate over course id
        count: { $sum: 1 },
      },
    },
  ];
  return Results.aggregate(pipeline);
};

Meteor.methods({
  stats() {
    // Create separate document for each chapter then increment count for each
    const userId = this.userId;
    const courseId = 'sFoGFr33tjFcrNoGR';
    // prevent error when empty array
    let chapterCount = 0;
    let completedCount = 0;
    // return an array of objects with count
    const chapterArray = chaptersInCourse(courseId);
    const completedArray = chaptersCompletedByUser(courseId, userId);
    // update counts
    if (chapterArray.length !== 0) {
      chapterCount = chapterArray[0].count;
    }
    if (completedArray.length !== 0) {
      completedCount = completedArray[0].count;
    }

    return {
      chapterCount,
      completedCount,
    };
  },
});
