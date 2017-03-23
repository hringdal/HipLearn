import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { AutoForm } from 'meteor/aldeed:autoform';

import { Books } from '../../api/books.js';

Template.listBooks.helpers({
  books() {
    return Books.find({});
  },
});

Template.editBook.helpers({
  getBooks() {
    return Books;
  },
  getBook() {
    const id = FlowRouter.getParam('_id');
    return Books.findOne(id);
  },
});

Template.newBook.helpers({
  getBooks() {
    return Books;
  },
});

AutoForm.addHooks(['createBook', 'updateBook'], {
  onSuccess(formType, result) {
    FlowRouter.go('books.index');
  },
});

AutoForm.debug();