"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.loader = loader;
exports.action = action;
exports.default = TrainingWizard;
var auth_server_1 = require("@carbon/auth/auth.server");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_confetti_explosion_1 = require("react-confetti-explosion");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var PASSING_THRESHOLD = 0.8;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, id, assignment, training, questions, sortedQuestions;
        var _d;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        role: "employee"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    id = params.id;
                    if (!id) {
                        throw new Response("Assignment ID is required", { status: 400 });
                    }
                    return [4 /*yield*/, (0, resources_1.getTrainingAssignmentForCompletion)(client, id)];
                case 2:
                    assignment = _e.sent();
                    if (assignment.error || !assignment.data) {
                        throw new Response("Training assignment not found", { status: 404 });
                    }
                    training = assignment.data.training;
                    if (!training || Array.isArray(training)) {
                        throw new Response("Training not found", { status: 404 });
                    }
                    if (training.status !== "Active") {
                        throw new Response("This training is not currently active", {
                            status: 400
                        });
                    }
                    questions = ((_d = training.trainingQuestion) !== null && _d !== void 0 ? _d : []);
                    sortedQuestions = questions.sort(function (a, b) { return a.sortOrder - b.sortOrder; });
                    return [2 /*return*/, {
                            assignment: assignment.data,
                            training: {
                                id: training.id,
                                name: training.name,
                                description: training.description,
                                content: training.content,
                                frequency: training.frequency,
                                type: training.type,
                                estimatedDuration: training.estimatedDuration
                            },
                            questions: sortedQuestions,
                            userId: userId,
                            companyId: companyId
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, id, formData, reset, answersJson, questionsJson, userAnswers, questions, correctAnswers, totalQuestions, gradedAnswers, _loop_1, _i, questions_1, question, score, passed;
        var _d, _e, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        role: "employee"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    id = params.id;
                    if (!id) {
                        throw new Response("Assignment ID is required", { status: 400 });
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    reset = formData.get("reset");
                    if (reset === "true") {
                        return [2 /*return*/, null];
                    }
                    answersJson = formData.get("answers");
                    questionsJson = formData.get("questions");
                    if (!answersJson || !questionsJson) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Missing answers or questions" }, { status: 400 })];
                    }
                    userAnswers = JSON.parse(answersJson);
                    questions = JSON.parse(questionsJson);
                    correctAnswers = 0;
                    totalQuestions = questions.length;
                    gradedAnswers = {};
                    _loop_1 = function (question) {
                        var userAnswer = userAnswers[question.id];
                        if (!userAnswer) {
                            gradedAnswers[question.id] = {
                                type: question.type,
                                value: "",
                                correct: false
                            };
                            return "continue";
                        }
                        var isCorrect = false;
                        switch (question.type) {
                            case "MultipleChoice":
                                isCorrect =
                                    (_e = (_d = question.correctAnswers) === null || _d === void 0 ? void 0 : _d.includes(userAnswer.value)) !== null && _e !== void 0 ? _e : false;
                                break;
                            case "TrueFalse":
                                isCorrect = question.correctBoolean === (userAnswer.value === "true");
                                break;
                            case "MultipleAnswers":
                                var userSelectedAnswers = userAnswer.value;
                                var correctAnswerSet = new Set((_f = question.correctAnswers) !== null && _f !== void 0 ? _f : []);
                                var userAnswerSet_1 = new Set(userSelectedAnswers);
                                isCorrect =
                                    correctAnswerSet.size === userAnswerSet_1.size &&
                                        __spreadArray([], correctAnswerSet, true).every(function (answer) { return userAnswerSet_1.has(answer); });
                                break;
                            case "MatchingPairs":
                                var userPairs_1 = userAnswer.value;
                                var correctPairs = (typeof question.matchingPairs === "string"
                                    ? JSON.parse(question.matchingPairs)
                                    : ((_g = question.matchingPairs) !== null && _g !== void 0 ? _g : []));
                                isCorrect = correctPairs.every(function (pair) { return userPairs_1[pair.left] === pair.right; });
                                break;
                            case "Numerical":
                                var userNumber = parseFloat(userAnswer.value);
                                var correctNumber = (_h = question.correctNumber) !== null && _h !== void 0 ? _h : 0;
                                var tolerance = (_j = question.tolerance) !== null && _j !== void 0 ? _j : 0;
                                isCorrect =
                                    Math.abs(userNumber - correctNumber) <= tolerance ||
                                        userNumber === correctNumber;
                                break;
                        }
                        if (isCorrect) {
                            correctAnswers++;
                        }
                        gradedAnswers[question.id] = __assign(__assign({}, userAnswer), { correct: isCorrect });
                    };
                    for (_i = 0, questions_1 = questions; _i < questions_1.length; _i++) {
                        question = questions_1[_i];
                        _loop_1(question);
                    }
                    score = totalQuestions > 0 ? correctAnswers / totalQuestions : 1;
                    passed = score >= PASSING_THRESHOLD;
                    if (!passed) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, resources_1.insertTrainingCompletion)(client, {
                            trainingAssignmentId: id,
                            employeeId: userId,
                            period: null,
                            companyId: companyId,
                            completedBy: userId,
                            createdBy: userId
                        })];
                case 3:
                    _k.sent();
                    _k.label = 4;
                case 4: return [2 /*return*/, {
                        passed: passed,
                        score: score,
                        totalQuestions: totalQuestions,
                        userAnswers: gradedAnswers,
                        correctAnswers: correctAnswers
                    }];
            }
        });
    });
}
function TrainingWizard() {
    var _a = (0, react_router_1.useLoaderData)(), training = _a.training, questions = _a.questions;
    var actionData = (0, react_router_1.useActionData)();
    var submit = (0, react_router_1.useSubmit)();
    var audioRef = (0, react_2.useRef)(null);
    var _b = (0, react_2.useState)(0), currentStep = _b[0], setCurrentStep = _b[1];
    var _c = (0, react_2.useState)({}), answers = _c[0], setAnswers = _c[1];
    var _d = (0, react_2.useState)(false), isSubmitted = _d[0], setIsSubmitted = _d[1];
    var totalSteps = questions.length + 1;
    var isContentStep = currentStep === 0;
    var currentQuestionIndex = currentStep - 1;
    var currentQuestion = questions[currentQuestionIndex];
    var isLastStep = currentStep === totalSteps - 1;
    (0, react_2.useEffect)(function () {
        if (actionData) {
            setIsSubmitted(true);
            if (actionData.passed && audioRef.current) {
                // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
                audioRef.current.play().catch(function () { });
            }
        }
    }, [actionData]);
    var progress = (0, react_2.useMemo)(function () {
        return ((currentStep + 1) / totalSteps) * 100;
    }, [currentStep, totalSteps]);
    var handleNext = function () {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    var handlePrevious = function () {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    var handleSubmit = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        var formData = new FormData();
        formData.append("answers", JSON.stringify(answers));
        formData.append("questions", JSON.stringify(questions));
        submit(formData, { method: "post" });
    };
    var handleRetry = function () {
        setIsSubmitted(false);
        setAnswers({});
        setCurrentStep(0);
        var formData = new FormData();
        formData.append("reset", "true");
        submit(formData, { method: "post", replace: true });
    };
    var handleAnswerChange = function (questionId, type, value) {
        setAnswers(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[questionId] = { type: type, value: value, correct: false }, _a)));
        });
    };
    var isCurrentQuestionAnswered = function () {
        var _a;
        if (isContentStep)
            return true;
        var answer = answers[currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.id];
        if (!answer)
            return false;
        switch (currentQuestion === null || currentQuestion === void 0 ? void 0 : currentQuestion.type) {
            case "MultipleChoice":
            case "TrueFalse":
                return answer.value !== "" && answer.value !== undefined;
            case "MultipleAnswers":
                return Array.isArray(answer.value) && answer.value.length > 0;
            case "MatchingPairs":
                var matchPairs = typeof currentQuestion.matchingPairs === "string"
                    ? JSON.parse(currentQuestion.matchingPairs)
                    : ((_a = currentQuestion.matchingPairs) !== null && _a !== void 0 ? _a : []);
                var matchUserPairs_1 = answer.value;
                return matchPairs.every(function (pair) {
                    return matchUserPairs_1[pair.left] && matchUserPairs_1[pair.left] !== "";
                });
            case "Numerical":
                return (answer.value !== "" && !isNaN(parseFloat(answer.value)));
            default:
                return false;
        }
    };
    var canProceed = isContentStep || isCurrentQuestionAnswered();
    if (isSubmitted && actionData) {
        return (<ResultsView actionData={actionData} training={training} questions={questions} onRetry={handleRetry} audioRef={audioRef}/>);
    }
    return (<react_1.VStack spacing={8} className="w-full min-h-screen max-w-4xl mx-auto p-4 md:p-8 pb-24">
      <react_1.BarProgress progress={progress} gradient/>

      <react_1.Card className="w-full">
        <react_1.CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 size-12 text-2xl p-3 rounded-full border bg-primary/10 text-primary">
                <lu_1.LuFlag />
              </div>
              <div className="flex flex-col">
                <span className="uppercase text-[10px] font-display font-bold text-muted-foreground">
                  Training
                </span>
                <react_1.CardTitle className="text-2xl">{training.name}</react_1.CardTitle>
              </div>
            </div>
            {training.estimatedDuration && (<span className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <lu_1.LuClock className="size-4"/>
                {training.estimatedDuration}
              </span>)}
          </div>
        </react_1.CardHeader>
        <react_1.CardContent>
          {isContentStep ? (<ContentStep training={training}/>) : (<QuestionStep question={currentQuestion} questionIndex={currentQuestionIndex} totalQuestions={questions.length} answer={answers[currentQuestion.id]} onAnswerChange={handleAnswerChange}/>)}
        </react_1.CardContent>
      </react_1.Card>

      <div className="flex justify-between w-full gap-4">
        <react_1.Button isRound variant="secondary" size="lg" leftIcon={<lu_1.LuChevronLeft />} onClick={handlePrevious} isDisabled={currentStep === 0}>
          Previous
        </react_1.Button>

        {isLastStep && questions.length > 0 ? (<react_1.Button isRound variant="primary" size="lg" rightIcon={<lu_1.LuCircleCheck />} onClick={handleSubmit} isDisabled={!canProceed}>
            Submit Training
          </react_1.Button>) : questions.length === 0 ? (<react_1.Button isRound variant="primary" size="lg" rightIcon={<lu_1.LuCircleCheck />} onClick={handleSubmit}>
            Complete Training
          </react_1.Button>) : (<react_1.Button isRound variant="primary" size="lg" rightIcon={<lu_1.LuChevronRight />} onClick={handleNext} isDisabled={!canProceed}>
            {isContentStep ? "Start Questions" : "Next Question"}
          </react_1.Button>)}
      </div>

      {!isContentStep && questions.length > 0 && (<div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>)}
    </react_1.VStack>);
}
function ContentStep(_a) {
    var training = _a.training;
    var hasContent = training.content &&
        typeof training.content === "object" &&
        "type" in training.content;
    var htmlContent = (0, react_2.useMemo)(function () {
        if (!hasContent)
            return "";
        try {
            return (0, react_1.generateHTML)(training.content);
        }
        catch (_a) {
            return "";
        }
    }, [training.content, hasContent]);
    return (<react_1.VStack spacing={4} className="w-full">
      {training.description && (<p className="text-muted-foreground">{training.description}</p>)}

      {training.estimatedDuration && (<div className="text-sm text-muted-foreground">
          Estimated duration: {training.estimatedDuration}
        </div>)}

      {htmlContent ? (<div className="prose dark:prose-invert max-w-none w-full" dangerouslySetInnerHTML={{
                __html: htmlContent
            }}/>) : (<p className="text-muted-foreground italic">
          No training content available. Please proceed to the questions.
        </p>)}
    </react_1.VStack>);
}
function QuestionStep(_a) {
    var question = _a.question, questionIndex = _a.questionIndex, totalQuestions = _a.totalQuestions, answer = _a.answer, onAnswerChange = _a.onAnswerChange;
    var t = (0, macro_1.useLingui)().t;
    var renderQuestionInput = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        switch (question.type) {
            case "MultipleChoice":
                return (<react_1.RadioGroup value={(_a = answer === null || answer === void 0 ? void 0 : answer.value) !== null && _a !== void 0 ? _a : ""} onValueChange={function (value) {
                        return onAnswerChange(question.id, question.type, value);
                    }} className="flex flex-col gap-2 w-full">
            {(_b = question.options) === null || _b === void 0 ? void 0 : _b.map(function (option, index) { return (<label key={index} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent">
                <react_1.RadioGroupItem value={option} id={"option-".concat(index)}/>
                <span>{option}</span>
              </label>); })}
          </react_1.RadioGroup>);
            case "TrueFalse":
                return (<react_1.RadioGroup value={(_c = answer === null || answer === void 0 ? void 0 : answer.value) !== null && _c !== void 0 ? _c : ""} onValueChange={function (value) {
                        return onAnswerChange(question.id, question.type, value);
                    }} className="flex flex-col gap-2 w-full">
            <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent">
              <react_1.RadioGroupItem value="true" id="true"/>
              <span>True</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent">
              <react_1.RadioGroupItem value="false" id="false"/>
              <span>False</span>
            </label>
          </react_1.RadioGroup>);
            case "MultipleAnswers":
                var selectedAnswers_1 = (_d = answer === null || answer === void 0 ? void 0 : answer.value) !== null && _d !== void 0 ? _d : [];
                return (<div className="flex flex-col gap-2 w-full">
            {(_e = question.options) === null || _e === void 0 ? void 0 : _e.map(function (option, index) { return (<label key={index} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent">
                <react_1.Checkbox checked={selectedAnswers_1.includes(option)} onCheckedChange={function (checked) {
                            var newAnswers = checked
                                ? __spreadArray(__spreadArray([], selectedAnswers_1, true), [option], false) : selectedAnswers_1.filter(function (a) { return a !== option; });
                            onAnswerChange(question.id, question.type, newAnswers);
                        }}/>
                <span>{option}</span>
              </label>); })}
          </div>);
            case "MatchingPairs":
                var pairs = typeof question.matchingPairs === "string"
                    ? JSON.parse(question.matchingPairs)
                    : ((_f = question.matchingPairs) !== null && _f !== void 0 ? _f : []);
                var userPairs_2 = (_g = answer === null || answer === void 0 ? void 0 : answer.value) !== null && _g !== void 0 ? _g : {};
                var rightOptions_1 = pairs.map(function (pair) { return pair.right; });
                return (<div className="flex flex-col gap-2 w-full">
            {pairs.map(function (pair, index) {
                        var _a;
                        return (<div key={index} className="flex items-center gap-4 p-3 border rounded-md">
                  <span className="font-medium min-w-[120px]">{pair.left}</span>
                  <span className="text-muted-foreground">
                    <lu_1.LuArrowRight className="text-muted-foreground"/>
                  </span>
                  <react_1.Select value={(_a = userPairs_2[pair.left]) !== null && _a !== void 0 ? _a : ""} onValueChange={function (value) {
                                var _a;
                                var newPairs = __assign(__assign({}, userPairs_2), (_a = {}, _a[pair.left] = value, _a));
                                onAnswerChange(question.id, question.type, newPairs);
                            }}>
                    <react_1.SelectTrigger className="flex-1">
                      <react_1.SelectValue placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select a match..."], ["Select a match..."])))}/>
                    </react_1.SelectTrigger>
                    <react_1.SelectContent>
                      {rightOptions_1.map(function (option, optIndex) { return (<react_1.SelectItem key={optIndex} value={option}>
                          {option}
                        </react_1.SelectItem>); })}
                    </react_1.SelectContent>
                  </react_1.Select>
                </div>);
                    })}
          </div>);
            case "Numerical":
                return (<div className="space-y-2">
            <react_1.NumberField value={parseFloat((_h = answer === null || answer === void 0 ? void 0 : answer.value) !== null && _h !== void 0 ? _h : "") || undefined} onChange={function (value) {
                        var _a;
                        return onAnswerChange(question.id, question.type, (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
                    }} className="max-w-xs">
              <react_1.NumberInput placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Enter your answer..."], ["Enter your answer..."])))}/>
            </react_1.NumberField>
            {((_j = question.tolerance) !== null && _j !== void 0 ? _j : 0) > 0 && (<p className="text-sm text-muted-foreground">
                Tolerance: +/- {question.tolerance}
              </p>)}
          </div>);
            default:
                return <p>Unknown question type</p>;
        }
    };
    return (<react_1.VStack spacing={4} className="w-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-display font-bold">
          Question {questionIndex + 1} of {totalQuestions}
        </h3>
        <p className="text-base">{question.question}</p>
      </div>

      {renderQuestionInput()}
    </react_1.VStack>);
}
function ResultsView(_a) {
    var actionData = _a.actionData, training = _a.training, questions = _a.questions, onRetry = _a.onRetry, audioRef = _a.audioRef;
    var scorePercent = Math.round(actionData.score * 100);
    return (<react_1.VStack spacing={8} className="w-full min-h-screen max-w-4xl mx-auto p-4 md:p-8 pb-24">
      <react_1.Card className="w-full">
        <react_1.CardHeader>
          <div className="flex items-center gap-4">
            <div className={(0, react_1.cn)("flex-shrink-0 size-12 text-3xl p-2 rounded-full border", actionData.passed
            ? "bg-emerald-100 text-emerald-500 border-emerald-500 dark:bg-emerald-900"
            : "bg-red-100 text-red-500 border-red-500 dark:bg-red-900")}>
              {actionData.passed ? <lu_1.LuCircleCheck /> : <lu_1.LuCircleX />}
            </div>
            <div className="flex flex-col">
              <span className="uppercase text-[10px] font-display font-bold text-muted-foreground">
                Training Complete
              </span>
              <react_1.CardTitle className="text-2xl">{training.name}</react_1.CardTitle>
            </div>
          </div>
        </react_1.CardHeader>
        <react_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className={(0, react_1.cn)("text-xl uppercase font-mono font-bold tracking-tight", actionData.passed ? "text-emerald-500" : "text-red-500")}>
                {actionData.passed ? "Passed" : "Failed"}
              </span>
              <div className={(0, react_1.cn)("text-6xl font-mono font-bold", actionData.passed ? "text-emerald-500" : "text-red-500")}>
                {scorePercent}%
              </div>
              <p className="text-sm text-muted-foreground">
                {actionData.correctAnswers} of {actionData.totalQuestions}{" "}
                correct
              </p>
              <p className="text-sm text-muted-foreground">
                (Passing score: {Math.round(PASSING_THRESHOLD * 100)}%)
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {actionData.passed ? (<>
                  <p className="text-base text-muted-foreground">
                    Congratulations! You have successfully completed this
                    training. Your completion has been recorded.
                  </p>
                  <react_1.Alert variant="success">
                    <lu_1.LuCircleCheck className="h-4 w-4"/>
                    <react_1.AlertTitle>Training Complete</react_1.AlertTitle>
                    <react_1.AlertDescription>
                      This training has been marked as completed for your
                      records.
                    </react_1.AlertDescription>
                  </react_1.Alert>
                </>) : (<p className="text-base text-muted-foreground">
                  Unfortunately, you did not pass this training. You need at
                  least {Math.round(PASSING_THRESHOLD * 100)}% to pass. Please
                  review the material and try again.
                </p>)}

              <react_1.HStack className="w-full justify-between">
                {!actionData.passed && (<react_1.Button size="lg" isRound variant="primary" onClick={onRetry} rightIcon={<lu_1.LuRefreshCcw />} className="flex-1">
                    Retry Training
                  </react_1.Button>)}
                <react_1.Button size="lg" isRound variant={actionData.passed ? "primary" : "secondary"} asChild leftIcon={<lu_1.LuHouse />} className="flex-1">
                  <react_router_1.Link to="/">Return Home</react_router_1.Link>
                </react_1.Button>
              </react_1.HStack>
            </div>
          </div>
        </react_1.CardContent>
      </react_1.Card>

      {questions.length > 0 && (<react_1.Card className="w-full">
          <react_1.CardHeader>
            <react_1.CardTitle>Question Review</react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.VStack spacing={4}>
              {questions.map(function (question, index) {
                var _a;
                var userAnswer = actionData.userAnswers[question.id];
                var isCorrect = (_a = userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.correct) !== null && _a !== void 0 ? _a : false;
                return (<div key={question.id} className={(0, react_1.cn)("w-full p-4 border rounded-lg", isCorrect
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800"
                        : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800")}>
                    <div className="flex items-start gap-3">
                      <div className={(0, react_1.cn)("flex-shrink-0 mt-1", isCorrect ? "text-emerald-500" : "text-red-500")}>
                        {isCorrect ? <lu_1.LuCircleCheck /> : <lu_1.LuCircleX />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-sm mt-2">
                          <span className="text-muted-foreground">
                            Your answer:{" "}
                          </span>
                          <span className={isCorrect ? "text-emerald-600" : "text-red-600"}>
                            {formatAnswer(userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.value, question)}
                          </span>
                        </p>
                        {!isCorrect && (<p className="text-sm mt-1">
                            <span className="text-muted-foreground">
                              Correct answer:{" "}
                            </span>
                            <span className="text-emerald-600">
                              {formatCorrectAnswer(question)}
                            </span>
                          </p>)}
                      </div>
                    </div>
                  </div>);
            })}
            </react_1.VStack>
          </react_1.CardContent>
        </react_1.Card>)}

      {actionData.passed && (<>
          <audio ref={audioRef} preload="auto">
            <source src="/victory.mp3" type="audio/mpeg"/>
          </audio>
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <react_confetti_explosion_1.default particleCount={200} force={1} duration={3000} width={1600}/>
          </div>
        </>)}
    </react_1.VStack>);
}
function formatAnswer(value, question) {
    if (value === undefined || value === "" || value === null) {
        return "Not answered";
    }
    switch (question.type) {
        case "TrueFalse":
            return value === "true" ? "True" : "False";
        case "MultipleAnswers":
            return Array.isArray(value) ? value.join(", ") : String(value);
        case "MatchingPairs":
            if (typeof value === "object" && !Array.isArray(value)) {
                return Object.entries(value)
                    .map(function (_a) {
                    var left = _a[0], right = _a[1];
                    return "".concat(left, " = ").concat(right);
                })
                    .join(", ");
            }
            return String(value);
        default:
            return String(value);
    }
}
function formatCorrectAnswer(question) {
    var _a, _b, _c, _d, _e;
    switch (question.type) {
        case "MultipleChoice":
            return (_b = (_a = question.correctAnswers) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
        case "TrueFalse":
            return question.correctBoolean ? "True" : "False";
        case "MultipleAnswers":
            return (_d = (_c = question.correctAnswers) === null || _c === void 0 ? void 0 : _c.join(", ")) !== null && _d !== void 0 ? _d : "";
        case "MatchingPairs":
            var displayPairs = typeof question.matchingPairs === "string"
                ? JSON.parse(question.matchingPairs)
                : ((_e = question.matchingPairs) !== null && _e !== void 0 ? _e : []);
            return displayPairs
                .map(function (pair) {
                return "".concat(pair.left, " = ").concat(pair.right);
            })
                .join(", ");
        case "Numerical":
            return String(question.correctNumber);
        default:
            return "";
    }
}
var templateObject_1, templateObject_2;
