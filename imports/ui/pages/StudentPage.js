import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

Template.student.onRendered(() => {
  $('.ui.sidebar')
    .sidebar({ context: $('#context') })
  ;
});
