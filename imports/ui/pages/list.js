import { Template } from 'meteor/templating';
// import Tasks from '../../api/tasks.js';

import './list.html';

// imports required components for this page
import '../components/task.js';

Template.List.helpers({
  // tasks() {
  //   return Tasks.find({});
  // },
  tasks: [
    { text: 'hello' },
    { text: 'spennende' },
    { text: 'flott' },
    { text: 'kjempelang tekst her nede langalasfdasfdafasdfasdfasdfasdf' },
  ],
});
