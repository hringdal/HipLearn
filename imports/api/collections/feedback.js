import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Feedback = new Mongo.Collection('feedback');
export default Feedback;

Feedback.schema = new SimpleSchema({
  // rules go here
});

// For automatic validation with Collection 2
Feedback.attachSchema(Feedback.schema);
