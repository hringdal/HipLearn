import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';
import { Books, Courses } from '../../api/collections.js';

Template.Form.onRendered(() => {
  $('.ui.modal')
    .modal({
      observeChanges: true,
    })
    .modal('show')
  ;
});

Template.Form.helpers({
  getCollection() {
    return Books;
  },
  getBook() {
    const id = FlowRouter.getQueryParam('_id');
    return Books.findOne(id);
  },
  optionsHelper() {
    return Courses.find({}, { _id: 1 });
  },
});

AutoForm.debug();
