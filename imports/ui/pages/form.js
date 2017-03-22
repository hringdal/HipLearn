import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Books } from '../../api/collections.js';

Template.Form.events({
  'submit #addBook': function (event) {
    event.preventDefault();
    const name = event.target.name.value;
    console.log(name);
    const courseId = event.target.course_id.value;
    console.log(courseId);
    $('.ui.form').form('reset');
  },
});

Template.Form.helpers({
  getCollection() {
    return Books;
  },
});

AutoForm.debug();
/*
 Template.Form.onRendered(() => {
 $('.ui.form').form({
 on: 'submit', fields: {
 name: {
 rules: [{
 type: 'empty', prompt: 'Please enter a name',
 },],
 }, course_id: {
 rules: [{
 type: 'empty', prompt: 'Please enter a Course ID',
 },],
 }, chapter: {
 rules: [{
 type: 'empty', prompt: 'Enter a chapter name or remove the chapter',
 },],
 },
 },
 });
 });
 */
