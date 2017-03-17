import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Results = new Mongo.Collection('results');
export default Results;

Results.schema = new SimpleSchema({
  user_id: {
    type: String,
  },
  chapter_id: {
    type: String,
  },
  course_id: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  //checked: { type: Boolean },
});

// For automatic validation with Collection 2
Results.attachSchema(Results.schema);
