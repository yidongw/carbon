"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = formatDuration;
exports.findTopicContext = findTopicContext;
exports.getLessonContext = getLessonContext;
exports.getNextLesson = getNextLesson;
exports.getPreviousLesson = getPreviousLesson;
var config_1 = require("~/config");
function formatDuration(duration) {
    var minutes = Math.floor(duration / 60);
    var seconds = duration % 60;
    return "".concat(minutes, ":").concat(seconds.toString().padStart(2, "0"));
}
function findTopicContext(topicId) {
    for (var _i = 0, modules_1 = config_1.modules; _i < modules_1.length; _i++) {
        var module = modules_1[_i];
        for (var _a = 0, _b = module.courses; _a < _b.length; _a++) {
            var course = _b[_a];
            var topic = course.topics.find(function (topic) { return topic.id === topicId; });
            if (topic) {
                return {
                    module: module,
                    course: course,
                    topic: topic
                };
            }
        }
    }
    return null;
}
function getLessonContext(lessonId) {
    for (var _i = 0, modules_2 = config_1.modules; _i < modules_2.length; _i++) {
        var module = modules_2[_i];
        for (var _a = 0, _b = module.courses; _a < _b.length; _a++) {
            var course = _b[_a];
            for (var _c = 0, _d = course.topics; _c < _d.length; _c++) {
                var topic = _d[_c];
                // Search in regular lessons
                var lesson = topic.lessons.find(function (lesson) { return lesson.id === lessonId; });
                if (lesson) {
                    return {
                        module: module,
                        course: course,
                        topic: topic,
                        lesson: lesson,
                        lessonType: "regular"
                    };
                }
                // Search in supplemental lessons
                if (topic.supplemental) {
                    var supplementalLesson = topic.supplemental.find(function (lesson) { return lesson.id === lessonId; });
                    if (supplementalLesson) {
                        return {
                            module: module,
                            course: course,
                            topic: topic,
                            lesson: supplementalLesson,
                            lessonType: "supplemental"
                        };
                    }
                }
            }
        }
    }
    return null;
}
function getNextLesson(lessonId) {
    var context = getLessonContext(lessonId);
    if (!context)
        return null;
    var topic = context.topic;
    var allLessons = topic.lessons;
    var currentIndex = allLessons.findIndex(function (lesson) { return lesson.id === lessonId; });
    if (currentIndex === -1 || currentIndex === allLessons.length - 1) {
        return null;
    }
    return allLessons[currentIndex + 1];
}
function getPreviousLesson(lessonId) {
    var context = getLessonContext(lessonId);
    if (!context)
        return null;
    var topic = context.topic;
    var allLessons = topic.lessons;
    var currentIndex = allLessons.findIndex(function (lesson) { return lesson.id === lessonId; });
    if (currentIndex <= 0) {
        return null;
    }
    return allLessons[currentIndex - 1];
}
