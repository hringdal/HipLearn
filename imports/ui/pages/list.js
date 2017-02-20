import { Template } from 'meteor/templating';
// import Tasks from '../../api/tasks.js';

import '../components/task.js';
import './list.html';

Template.List.helpers({
  // tasks() {
  //   return Tasks.find({});
  // },
  tasks: [
    { text: 'hello' },
    { text: 'spennende' },
  ],
});

Template.List.events({

});
