import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {$} from 'meteor/jquery';
import {ReactiveVar} from 'meteor/reactive-var';

import {Books} from '../../api/books.js';
import {Courses, AddCourseSchema} from '../../api/courses.js';

Template.studentPage.onCreated(function init() {
    this.course = new ReactiveVar(false);
});

Template.studentPage.onRendered(function render() {
    $('.ui.sidebar')
        .sidebar({context: $('.context')});
    $('#student')
        .modal('attach events', '#clickable', 'show')
    ;
});

Template.studentPage.helpers({
    // fixes error with getting data before collection is ready
    authInProcess() {
        return Meteor.loggingIn();
    },
    //funksjon for bakgrunn på valgte fag
    selectedCourceBoolean() {
        this.course = new ReactiveVar(false);
    },
    // return list of courses in current user document
    courses() {
        if (Meteor.user()) {
            const courseIds = Meteor.user().courses;
            return Courses.find({_id: {$in: courseIds}}, {sort: {name: 1}});
        }
        return ['No courses'];
    },
    // change course based on reactivevar course
    selectedCourse() {
        const courseId = Template.instance().course.get();
        return Books.find({course_id: courseId});
    },
    addCourseSchema() {
        return AddCourseSchema;
    },
    getCourses() {
        return Courses;
    },
});

Template.studentPage.events({
    'click .test': function (event, instance) {
        instance.course.set(this._id);
    },
});
