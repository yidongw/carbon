"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = void 0;
exports.default = CourseRoute;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var config_1 = require("~/config");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var video_1 = require("~/utils/video");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var courseId;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_c) {
        courseId = params.courseId;
        if (!courseId) {
            throw new Error("Course ID is required");
        }
        return [2 /*return*/, {}];
    });
}); };
exports.loader = loader;
function CourseRoute() {
    var _a, _b;
    var _c = (0, hooks_1.useProgress)(), lessonCompletions = _c.lessonCompletions, challengeAttempts = _c.challengeAttempts;
    var _d = (0, react_router_1.useParams)(), moduleId = _d.moduleId, courseId = _d.courseId;
    var module = config_1.modules.find(function (module) { return module.id === moduleId; });
    var course = module === null || module === void 0 ? void 0 : module.courses.find(function (course) { return course.id === courseId; });
    var totalDuration = (_a = course === null || course === void 0 ? void 0 : course.topics.reduce(function (acc, topic) {
        return (acc + topic.lessons.reduce(function (acc, lesson) { return acc + lesson.duration; }, 0));
    }, 0)) !== null && _a !== void 0 ? _a : 0;
    var totalChallenges = (_b = course === null || course === void 0 ? void 0 : course.topics.reduce(function (acc, topic) {
        return acc + (topic.challenge === undefined ? 0 : 1);
    }, 0)) !== null && _b !== void 0 ? _b : 0;
    if (!course) {
        throw new Error("Course not found");
    }
    // Filter data for current course
    var completedLessons = lessonCompletions
        .filter(function (completion) { return completion.courseId === course.id; })
        .map(function (completion) { return completion.lessonId; });
    var completedChallenges = Array.from(new Set(challengeAttempts
        .filter(function (attempt) { return attempt.courseId === course.id && attempt.passed; })
        .map(function (attempt) { return attempt.topicId; })));
    var attemptsByTopic = challengeAttempts
        .filter(function (attempt) { return attempt.courseId === course.id; })
        .reduce(function (acc, attempt) {
        var _a;
        acc[attempt.topicId] = ((_a = acc[attempt.topicId]) !== null && _a !== void 0 ? _a : 0) + 1;
        return acc;
    }, {});
    var completionPercentage = Math.min(Math.round((completedChallenges.length / totalChallenges) * 100), 100);
    return (<react_1.VStack spacing={4} className="w-full">
      <div className="flex flex-col w-full">
        <div className="border rounded-lg rounded-b-none px-8 py-3" style={{
            backgroundColor: module === null || module === void 0 ? void 0 : module.background,
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase font-display font-bold opacity-80">
              Section
            </span>
            <span className="uppercase text-sm font-display font-bold">
              {module === null || module === void 0 ? void 0 : module.name}
            </span>
          </div>
        </div>
        <div className="border border-b-0 border-t-0 p-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-12 text-2xl p-3 rounded-lg" style={{
            backgroundColor: module === null || module === void 0 ? void 0 : module.background,
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
                {course.icon}
              </div>
              <div className="flex flex-col">
                <h1 className="uppercase text-[10px] font-display font-bold text-muted-foreground">
                  Course
                </h1>
                <h2 className="text-2xl font-display tracking-tight">
                  {course.name}
                </h2>
              </div>
            </div>
            <p className="text-sm">{course.description}</p>
          </div>
        </div>
        <div className="border rounded-lg rounded-t-none px-8 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="font-bold">Length:</span>
                <span className="text-muted-foreground">
                  {(0, video_1.formatDuration)(totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">Challenges:</span>
                <span className="text-muted-foreground">{totalChallenges}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-emerald-500">
                {completionPercentage}%
              </span>
              <react_1.Progress value={completionPercentage}/>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {course.topics.map(function (topic, index) {
            var _a, _b;
            var hasChallenge = topic.challenge && topic.challenge.length > 0;
            var isChallengeCompleted = hasChallenge && completedChallenges.includes(topic.id);
            var isChallengeAttempted = hasChallenge && attemptsByTopic[topic.id];
            var challengeAttempts = (_a = attemptsByTopic[topic.id]) !== null && _a !== void 0 ? _a : 0;
            var isFirst = index === 0;
            var isLast = index === course.topics.length - 1;
            return (<div key={topic.id} className={(0, react_1.cn)("border p-8 w-full", isFirst && "rounded-t-lg", isLast && "rounded-b-lg", isFirst && !isLast && "rounded-b-none", isLast && !isFirst && "border-t-0 rounded-t-none")}>
              <div className="grid grid-cols-2 gap-12">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] uppercase font-display font-bold text-muted-foreground">
                    Topic
                  </h3>
                  <h2 className="text-xl font-display tracking-tight">
                    {topic.name}
                  </h2>
                  <p className="text-sm">{topic.description}</p>
                </div>
                <div className="flex flex-col gap-4 py-8 w-full text-sm">
                  <div className="flex flex-col gap-0">
                    {topic.lessons.map(function (lesson) {
                    var isCompleted = completedLessons.includes(lesson.id);
                    return (<react_router_1.Link key={lesson.id} to={path_1.path.to.lesson(lesson.id)} className="flex items-center justify-between gap-2 w-full rounded-md py-1.5 px-3 hover:bg-accent">
                          <div className="flex items-center gap-2">
                            {isCompleted ? (<lu_1.LuCircleCheck className="size-4 flex-shrink-0 text-emerald-500"/>) : (<lu_1.LuCirclePlay className="size-4 flex-shrink-0 text-muted-foreground"/>)}
                            <span>{lesson.name}</span>
                          </div>
                          <span className="text-muted-foreground text-xs">
                            {(0, video_1.formatDuration)(lesson.duration)}
                          </span>
                        </react_router_1.Link>);
                })}
                  </div>
                  {hasChallenge ? (isChallengeCompleted ? (<react_1.Button variant="primary" leftIcon={<lu_1.LuCircleCheck className="size-4 flex-shrink-0 text-emerald-500"/>}>
                        Topic Challenge Completed
                      </react_1.Button>) : (<react_1.Button variant="secondary" leftIcon={isChallengeAttempted ? <lu_1.LuRotateCcw /> : <lu_1.LuFlag />} asChild>
                        <react_router_1.Link to={path_1.path.to.challenge(topic.id)}>
                          {isChallengeAttempted ? (<span>
                              Retake Topic Challenge{" "}
                              <span className="text-xs text-muted-foreground italic">
                                {challengeAttempts} attempt
                                {challengeAttempts === 1 ? "" : "s"} made
                              </span>
                            </span>) : ("Take Topic Challenge")}
                        </react_router_1.Link>
                      </react_1.Button>)) : null}
                  {topic.supplemental && topic.supplemental.length > 0 && (<div className="flex flex-col gap-0">
                      <h3 className="text-[10px] uppercase font-display font-bold text-muted-foreground">
                        Supplemental Videos
                      </h3>
                      {(_b = topic.supplemental) === null || _b === void 0 ? void 0 : _b.map(function (lesson) {
                        var isCompleted = completedLessons.includes(lesson.id);
                        return (<react_router_1.Link key={lesson.id} to={path_1.path.to.lesson(lesson.id)} className="flex items-center justify-between gap-2 w-full rounded-md py-1.5 px-3 hover:bg-accent">
                            <div className="flex items-center gap-2">
                              {isCompleted ? (<lu_1.LuCircleCheck className="size-4 flex-shrink-0 text-emerald-500"/>) : (<lu_1.LuCirclePlay className="size-4 flex-shrink-0 text-muted-foreground"/>)}
                              <span>{lesson.name}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {(0, video_1.formatDuration)(lesson.duration)}
                            </span>
                          </react_router_1.Link>);
                    })}
                    </div>)}
                </div>
              </div>
            </div>);
        })}
      </div>
    </react_1.VStack>);
}
