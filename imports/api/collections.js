import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Schemas } from './schemas.js';

export const Books = new Mongo.Collection('books');
Books.attachSchema(Schemas.Book);

export const Courses = new Mongo.Collection('courses');
Courses.attachSchema(Schemas.Course);

export const Chapters = new Mongo.Collection('chapters');
Chapters.attachSchema(Schemas.Chapter);

export const Results = new Mongo.Collection('results');
Results.attachSchema(Schemas.Result);

Meteor.users.attachSchema(Schemas.User);
