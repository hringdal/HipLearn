import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

const ResultSchema = new SimpleSchema({
  user_id: {
    type: String,
    autoValue() {
      return this.userId;
    },
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
