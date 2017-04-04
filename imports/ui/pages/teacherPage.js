import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.teacherPage2.helpers({
// change course based on reactivevar course
  selectedCourse() {
    console.log('selected course id: ', FlowRouter.getParam('courseId'));
    return FlowRouter.getParam('courseId');
  },
});
