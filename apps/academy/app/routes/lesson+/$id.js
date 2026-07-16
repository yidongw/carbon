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
exports.action = exports.loader = void 0;
exports.default = LessonRoute;
var auth_1 = require("@carbon/auth");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Share_1 = require("~/components/Share");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var video_1 = require("~/utils/video");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var lessonId, context;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_c) {
        lessonId = params.id;
        if (!lessonId) {
            throw new Error("Lesson ID is required");
        }
        context = (0, video_1.getLessonContext)(lessonId);
        if (!context) {
            throw new Error("Lesson not found");
        }
        return [2 /*return*/, {}];
    });
}); };
exports.loader = loader;
var action = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var lessonId, context, session, course, client, insert;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                lessonId = params.id;
                if (!lessonId) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Lesson ID is required" }, { status: 400 })];
                }
                context = (0, video_1.getLessonContext)(lessonId);
                if (!context) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Lesson not found" }, { status: 404 })];
                }
                return [4 /*yield*/, (0, session_server_1.getOrRefreshAuthSession)(request)];
            case 1:
                session = _c.sent();
                if (!session) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Authentication required" }, { status: 401 })];
                }
                course = context.course;
                client = (0, auth_1.getCarbon)(session.accessToken);
                return [4 /*yield*/, client.from("lessonCompletion").insert({
                        userId: session.userId,
                        courseId: course.id,
                        lessonId: lessonId
                    })];
            case 2:
                insert = _c.sent();
                if (insert.error) {
                    return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Failed to complete lesson" }, { status: 500 })];
                }
                return [2 /*return*/, { success: true }];
        }
    });
}); };
exports.action = action;
function LessonRoute() {
    var _this = this;
    var _a, _b;
    var _c = (0, hooks_1.useProgress)(), lessonCompletions = _c.lessonCompletions, challengeAttempts = _c.challengeAttempts;
    var id = (0, react_router_1.useParams)().id;
    var fetcher = (0, react_router_1.useFetcher)();
    if (!id) {
        throw new Error("Lesson ID is required");
    }
    var context = (0, video_1.getLessonContext)(id);
    if (!context) {
        throw new Error("Lesson not found");
    }
    var module = context.module, course = context.course, topic = context.topic, lesson = context.lesson;
    var nextLesson = (0, video_1.getNextLesson)(id);
    var previousLesson = (0, video_1.getPreviousLesson)(id);
    var hasChallenge = topic.challenge && topic.challenge.length > 0;
    // Filter data for current course/topic
    var completedLessons = lessonCompletions
        .filter(function (completion) { return completion.courseId === course.id; })
        .map(function (completion) { return completion.lessonId; });
    var completedChallenges = challengeAttempts
        .filter(function (attempt) { return attempt.courseId === course.id && attempt.passed; })
        .map(function (attempt) { return attempt.topicId; });
    var attemptsByTopic = challengeAttempts
        .filter(function (attempt) { return attempt.courseId === course.id; })
        .reduce(function (acc, attempt) {
        var _a;
        acc[attempt.topicId] = ((_a = acc[attempt.topicId]) !== null && _a !== void 0 ? _a : 0) + 1;
        return acc;
    }, {});
    var isChallengeCompleted = hasChallenge && completedChallenges.includes(topic.id);
    var isChallengeAttempted = hasChallenge && attemptsByTopic[topic.id];
    var challengeAttemptCount = (_a = attemptsByTopic[topic.id]) !== null && _a !== void 0 ? _a : 0;
    var onComplete = function (lessonId) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            fetcher.submit(null, {
                method: "POST",
                action: path_1.path.to.lesson(id)
            });
            return [2 /*return*/];
        });
    }); };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var handleMessage = function (event) {
            var _a;
            try {
                var data_1 = JSON.parse(event.data);
                if (data_1.event === "ready" && data_1.context === "player.js") {
                    var iframe = document.getElementById("loom-embed");
                    if (iframe) {
                        (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(JSON.stringify({
                            method: "addEventListener",
                            value: "ended",
                            context: "player.js"
                        }), "*");
                    }
                }
                if (data_1.event === "ended" && data_1.context === "player.js") {
                    onComplete(id);
                }
            }
            catch (error) {
                console.error("Error parsing message data", error);
            }
        };
        window.addEventListener("message", handleMessage);
        return function () {
            window.removeEventListener("message", handleMessage);
        };
    }, [id]);
    return (<div className="w-full px-4 max-w-5xl mx-auto mt-4 pb-24 flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <react_1.Button variant="primary" leftIcon={<lu_1.LuChevronLeft />} className="mr-2" asChild>
          <react_router_1.Link to={path_1.path.to.course(module.id, course.id)}>Back to course</react_router_1.Link>
        </react_1.Button>

        <react_1.Button variant="link" className="text-sm text-muted-foreground" asChild>
          <react_router_1.Link to={path_1.path.to.course(module.id, course.id)}>{course.name}</react_router_1.Link>
        </react_1.Button>

        <span className="text-muted-foreground text-sm">/</span>

        <span className="text-muted-foreground text-sm font-bold">
          {topic.name}
        </span>
      </div>

      <div className="flex flex-col w-full">
        <div className="w-full aspect-video bg-black rounded-t-lg overflow-hidden">
          <div style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: "0"
        }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <react_1.Spinner className="h-8 w-8"/>
            </div>
            <iframe key={id} id="loom-embed" title={lesson.name} src={"https://www.loom.com/embed/".concat((_b = lesson.loomUrl.split(/(?:share|embed)\//)[1]) === null || _b === void 0 ? void 0 : _b.split("?")[0], "?hideEmbedTopBar=true")} allowFullScreen style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%"
        }}/>
          </div>
        </div>
        <div className="dark w-full h-12 rounded-b-lg flex items-center justify-end gap-2 px-3" style={{
            backgroundColor: module.background
        }}>
          <Share_1.default text={typeof window !== "undefined" ? window.location.href : ""}/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col w-full">
          <div className="border rounded-lg rounded-b-none p-4" style={{
            backgroundColor: module === null || module === void 0 ? void 0 : module.background,
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 size-12 text-2xl p-3 rounded-lg bg-black/20" style={{
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
                  {course.icon}
                </div>
                <div className="flex flex-col">
                  <h1 className="uppercase text-[10px] font-display font-bold">
                    Lesson
                  </h1>
                  <h2 className="text-2xl font-display tracking-tight">
                    {lesson.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border rounded-b-lg border-t-0 px-6 py-4">
            <h4 className="text-lg font-display font-bold">Description</h4>
            <p className="text-base text-muted-foreground">
              {lesson.description}
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <react_1.Button variant="secondary" leftIcon={<lu_1.LuChevronLeft className="size-4"/>} disabled={!previousLesson} asChild={!!previousLesson} className={!previousLesson ? "opacity-50 cursor-not-allowed" : ""}>
              {previousLesson ? (<react_router_1.Link to={path_1.path.to.lesson(previousLesson.id)}>
                  Previous Lesson
                </react_router_1.Link>) : (<span>Previous Lesson</span>)}
            </react_1.Button>

            <react_1.Button variant={!nextLesson ? "secondary" : "primary"} rightIcon={<lu_1.LuChevronRight className="size-4"/>} disabled={!nextLesson} asChild={!!nextLesson} className={!nextLesson ? "opacity-50 cursor-not-allowed" : ""}>
              {nextLesson ? (<react_router_1.Link to={path_1.path.to.lesson(nextLesson.id)}>Next Lesson</react_router_1.Link>) : (<span>Next Lesson</span>)}
            </react_1.Button>
          </div>

          {/* Lesson List */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-display font-bold text-muted-foreground mb-3">
              Lessons in this topic
            </h3>
            <div className="flex flex-col gap-1">
              {topic.lessons.map(function (topicLesson) {
            var isCompleted = completedLessons.includes(topicLesson.id);
            return (<react_router_1.Link key={topicLesson.id} to={path_1.path.to.lesson(topicLesson.id)} className={"flex items-center justify-between gap-2 w-full rounded-md py-2 px-3 text-sm transition-colors ".concat(topicLesson.id === lesson.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent")}>
                    <div className="flex items-center gap-2">
                      {isCompleted ? (<lu_1.LuCircleCheck className="size-4 flex-shrink-0 text-emerald-500"/>) : (<lu_1.LuCirclePlay className="size-4 flex-shrink-0 text-muted-foreground"/>)}
                      <span className={topicLesson.id === lesson.id ? "font-medium" : ""}>
                        {topicLesson.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {(0, video_1.formatDuration)(topicLesson.duration)}
                    </span>
                  </react_router_1.Link>);
        })}
            </div>
          </div>
          {hasChallenge ? (isChallengeCompleted ? (<react_1.Button variant="primary" leftIcon={<lu_1.LuCircleCheck className="size-4 flex-shrink-0 text-emerald-500"/>}>
                Topic Challenge Completed
              </react_1.Button>) : (<react_1.Button variant="secondary" leftIcon={<lu_1.LuFlag className="size-4"/>} asChild>
                <react_router_1.Link to={path_1.path.to.challenge(topic.id)}>
                  {isChallengeAttempted
                ? "Retake Topic Challenge (".concat(challengeAttemptCount, " attempt").concat(challengeAttemptCount === 1 ? "" : "s", ")")
                : "Take Topic Challenge"}
                </react_router_1.Link>
              </react_1.Button>)) : null}
        </div>
      </div>
    </div>);
}
