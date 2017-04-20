import { Meteor } from 'meteor/meteor';
import { Books } from './books.js';
import { Results } from './results.js';

// return the total number of chapters in course with id equal to courseId
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

// return the number of completed chapters in course with courseId for user with userId
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

// return an array of the number of completed chapters by each student in course with id courseId
const chaptersCompletedByStudents = function chaptersCompletedByStudents(courseId) {
  const pipeline = [
    { // Comment out this pair of braces to include all books
      $match: { course_id: courseId, checked: true },
    },
    {
      $group: {
        _id: '$user_id',  // Set to null to aggregate over all books,
        // Set to course_id to aggregate over course id
        count: { $sum: 1 },
      },
    },
  ];
  return Results.aggregate(pipeline);
};

Meteor.methods({
  // return an object with the total number of chapters in a course, and how many chapters
  // the currently logged on user has completed in the course
  userStats(courseId) {
    check(courseId, String);
    // Create separate document for each chapter then increment count for each
    const userId = this.userId;
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
  averageUserStats(courseId) {
    check(courseId, String);

    let chapterCount = 0;
    let sum = 0;
    let studentCount = 1; // prevent divide-by-zero error

    const chapterArray = chaptersInCourse(courseId);
    if (chapterArray.length !== 0) {
      chapterCount = chapterArray[0].count;
    }

    const completedByStudentsArray = chaptersCompletedByStudents(courseId);
    if (completedByStudentsArray.length !== 0) {
      studentCount = completedByStudentsArray.length;

      for (let i = 0; i < completedByStudentsArray.length; i += 1) {
        sum += completedByStudentsArray[i].count;
      }
    }

    const averageCount = sum / studentCount;

    return {
      chapterCount,
      averageCount,
    };
  },
});
