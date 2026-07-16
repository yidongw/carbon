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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.default = ChallengeRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_confetti_explosion_1 = require("react-confetti-explosion");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var useUser_1 = require("~/hooks/useUser");
var path_1 = require("~/utils/path");
var video_1 = require("~/utils/video");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, reset, topicId, answers, shuffledIndices, context, topic, course, correctAnswers, totalQuestions, incorrectQuestions, passed, error;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _d.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _d.sent();
                    reset = formData.get("reset");
                    // Handle reset case
                    if (reset === "true") {
                        return [2 /*return*/, null];
                    }
                    topicId = formData.get("topicId");
                    answers = JSON.parse(formData.get("answers"));
                    shuffledIndices = JSON.parse(formData.get("shuffledIndices"));
                    context = (0, video_1.findTopicContext)(topicId);
                    if (!context) {
                        throw new Error("Topic not found");
                    }
                    topic = context.topic, course = context.course;
                    correctAnswers = 0;
                    totalQuestions = topic.challenge.length;
                    incorrectQuestions = [];
                    // Map answers back to original question order using shuffled indices
                    shuffledIndices.forEach(function (originalIndex, shuffledIndex) {
                        if (answers[shuffledIndex] === topic.challenge[originalIndex].correctAnswer) {
                            correctAnswers++;
                        }
                        else {
                            incorrectQuestions.push(originalIndex);
                        }
                    });
                    passed = correctAnswers === totalQuestions;
                    return [4 /*yield*/, client.from("challengeAttempt").insert({
                            userId: userId,
                            courseId: course.id,
                            topicId: topicId,
                            passed: passed
                        })];
                case 3:
                    error = (_d.sent()).error;
                    if (error) {
                        console.error(error);
                    }
                    return [2 /*return*/, {
                            passed: passed,
                            score: correctAnswers,
                            totalQuestions: totalQuestions,
                            userAnswers: answers,
                            incorrectQuestions: incorrectQuestions,
                            shuffledIndices: shuffledIndices
                        }];
            }
        });
    });
}
function ChallengeRoute() {
    var id = (0, react_router_1.useParams)().id;
    var user = (0, useUser_1.useOptionalUser)();
    var actionData = (0, react_router_1.useActionData)();
    var audioRef = (0, react_2.useRef)(null);
    var submit = (0, react_router_1.useSubmit)();
    if (!id) {
        throw new Error("Topic ID is required");
    }
    var context = (0, video_1.findTopicContext)(id);
    if (!context) {
        throw new Error("Topic not found");
    }
    var module = context.module, course = context.course, topic = context.topic;
    // Shuffle the questions
    var shuffledQuestions = (0, react_2.useMemo)(function () { return __spreadArray([], topic.challenge, true).sort(function () { return Math.random() - 0.5; }); }, [topic.challenge]);
    var _a = (0, react_2.useState)([]), answers = _a[0], setAnswers = _a[1];
    var _b = (0, react_2.useState)(false), isSubmitted = _b[0], setIsSubmitted = _b[1];
    (0, react_2.useEffect)(function () {
        if (actionData) {
            setIsSubmitted(true);
            if (actionData.passed && audioRef.current) {
                audioRef.current.play();
            }
        }
    }, [actionData]);
    var onAnswerChange = function (questionIndex, answerIndex) {
        var newAnswers = __spreadArray([], answers, true);
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };
    var onTryAgain = function () {
        setIsSubmitted(false);
        setAnswers([]);
        // Clear the action data by submitting a reset form
        var formData = new FormData();
        formData.append("reset", "true");
        submit(formData, { method: "post", replace: true });
    };
    var onSubmit = function () {
        if (answers.length !== shuffledQuestions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        // Smooth scroll to top when submitting
        window.scrollTo({ top: 0, behavior: "smooth" });
        var formData = new FormData();
        formData.append("topicId", id);
        formData.append("answers", JSON.stringify(answers));
        formData.append("shuffledIndices", JSON.stringify(shuffledQuestions.map(function (q) { return topic.challenge.indexOf(q); })));
        submit(formData, { method: "post" });
    };
    var getAnswerStatus = function (questionIndex, optionIndex) {
        if (!actionData || isSubmitted === false)
            return null;
        var originalQuestionIndex = actionData.shuffledIndices[questionIndex];
        var question = topic.challenge[originalQuestionIndex];
        var userAnswer = actionData.userAnswers[questionIndex];
        var isCorrect = optionIndex === question.correctAnswer;
        var isSelected = optionIndex === userAnswer;
        if (isCorrect && isSelected)
            return "correct";
        if (!isCorrect && isSelected)
            return "incorrect";
        return null;
    };
    var getAnswerStyles = function (status) {
        switch (status) {
            case "correct":
                return "bg-emerald-100 border-emerald-500 text-emerald-800 dark:bg-emerald-900 dark:border-emerald-500 dark:text-emerald-500";
            case "incorrect":
                return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-500 dark:text-red-500";
            default:
                return "hover:bg-accent";
        }
    };
    return (<div className="w-full px-4 max-w-5xl mx-auto mt-8 pb-24 flex flex-col gap-8">
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
        <div className="border rounded-lg rounded-b-none p-4" style={{
            backgroundColor: module === null || module === void 0 ? void 0 : module.background,
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 size-12 text-2xl p-3 rounded-full border" style={{
            backgroundColor: module === null || module === void 0 ? void 0 : module.background,
            borderColor: module === null || module === void 0 ? void 0 : module.foreground,
            color: module === null || module === void 0 ? void 0 : module.foreground
        }}>
                <lu_1.LuFlag />
              </div>
              <div className="flex flex-col">
                <h1 className="uppercase text-[10px] font-display font-bold">
                  Challenge
                </h1>
                <h2 className="text-2xl font-display tracking-tight">
                  {topic.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border rounded-b-lg border-t-0 px-6 py-4">
          <p className="text-base text-muted-foreground">
            Test your knowledge with these multiple choice questions. You need
            to get at least 100% correct to pass.
          </p>
        </div>
      </div>

      {isSubmitted && actionData && (<div className="border rounded-lg px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-display uppercase">Scoreboard</span>
              <span className={(0, react_1.cn)("text-xl font-display uppercase font-bold tracking-tight", actionData.passed ? "text-emerald-500" : "text-red-500")}>
                You Scored
              </span>
              <div className={(0, react_1.cn)("text-6xl font-display font-bold", actionData.passed ? "text-emerald-500" : "text-red-500")}>
                {Math.round((actionData.score / actionData.totalQuestions) * 100)}
                %
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-base text-muted-foreground">
                You can continue by returning to the course listing or you can
                retry this challenge and try for 100%.
              </p>
              <div className="flex items-center gap-4 w-full justify-between">
                <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuChevronLeft />} asChild>
                  <react_router_1.Link to={path_1.path.to.course(module.id, course.id)}>
                    Return to Course Page
                  </react_router_1.Link>
                </react_1.Button>
                {!(actionData === null || actionData === void 0 ? void 0 : actionData.passed) && (<react_1.Button size="lg" variant="primary" onClick={onTryAgain} rightIcon={<lu_1.LuRefreshCcw />}>
                    Retry Challenge
                  </react_1.Button>)}
              </div>
            </div>
          </div>
        </div>)}

      {user ? (<react_router_1.Form method="post" className="flex flex-col gap-6">
          <input type="hidden" name="topicId" value={id}/>
          <input type="hidden" name="answers" value={JSON.stringify(answers)}/>

          {shuffledQuestions.map(function (question, questionIndex) { return (<div key={question.id} className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-display font-bold">
                    Question {questionIndex + 1}:
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {question.question}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {question.options.map(function (option, optionIndex) {
                    var answerStatus = getAnswerStatus(questionIndex, optionIndex);
                    var isDisabled = isSubmitted && !!actionData;
                    return (<label key={optionIndex} className={"flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors ".concat(isDisabled ? "cursor-default" : "hover:bg-accent", " ").concat(getAnswerStyles(answerStatus))}>
                        <input type="radio" name={"question-".concat(questionIndex)} value={optionIndex} checked={answers[questionIndex] === optionIndex} onChange={function () {
                            return onAnswerChange(questionIndex, optionIndex);
                        }} disabled={isDisabled} className="size-4"/>
                        <span className="text-sm">{option}</span>
                        {answerStatus && (<span className="ml-auto text-xs font-medium">
                            {answerStatus === "correct" && "✓ Correct"}
                            {answerStatus === "incorrect" && "✗ Incorrect"}
                          </span>)}
                      </label>);
                })}
                </div>
              </div>
            </div>); })}

          {!isSubmitted && (<div className="rounded-lg border flex flex-row-reverse justify-between p-6 gap-12 items-center">
              <react_1.Button type="button" size="lg" variant="primary" leftIcon={<lu_1.LuCircleCheck />} onClick={onSubmit} disabled={answers.length !== topic.challenge.length} className={answers.length !== topic.challenge.length
                    ? "opacity-50 cursor-not-allowed"
                    : ""}>
                Submit Answers
              </react_1.Button>
              <react_1.Alert variant="warning" className="border-none">
                <lu_1.LuTriangleAlert className="h-4 w-4"/>
                <react_1.AlertTitle>
                  Please ensure that all questions are answered correctly
                </react_1.AlertTitle>
                <react_1.AlertDescription>
                  You can retake challenges, but they will be completely
                  randomized when a new one is started.
                </react_1.AlertDescription>
              </react_1.Alert>
            </div>)}
        </react_router_1.Form>) : (<div className="flex justify-between items-center gap-4 border rounded-lg py-6 px-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-display font-bold">Challenge Rules</h3>
            <p className="text-base text-muted-foreground">
              There is no limit on attempts, but retries will be randomized.
            </p>
          </div>
          <react_1.Button size="lg" variant="primary" asChild>
            <react_router_1.Link to={"".concat(path_1.path.to.login, "?redirectTo=").concat(path_1.path.to.challenge(id))}>
              Login to Take Challenge
            </react_router_1.Link>
          </react_1.Button>
        </div>)}

      {(actionData === null || actionData === void 0 ? void 0 : actionData.passed) && (<>
          <audio ref={audioRef} preload="auto">
            <source src="/victory.mp3" type="audio/mpeg"/>
          </audio>
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <react_confetti_explosion_1.default particleCount={200} force={1} duration={3000} width={1600}/>
          </div>
        </>)}
    </div>);
}
