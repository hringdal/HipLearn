import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Chapters = new Mongo.Collection('Chapters');
export default Chapters;

Chapters.schema = new SimpleSchema({
  // rules go here
});

// For automatic validation with Collection 2
Chapters.attachSchema(Chapters.schema);
