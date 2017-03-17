import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Chapters = new Mongo.Collection('chapters');
export default Chapters;

Chapters.schema = new SimpleSchema({
  course_id: {
    type: String,
  },
  name: {
    type: String,
  },
  level: {
    type: Number,
  },
});

// For automatic validation with Collection 2
Chapters.attachSchema(Chapters.schema);
