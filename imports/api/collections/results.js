import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Results = new Mongo.Collection('Results');
export default Results;

Results.schema = new SimpleSchema({
  // rules go here
});

// For automatic validation with Collection 2
Results.attachSchema(Results.schema);
