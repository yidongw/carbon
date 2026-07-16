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
exports.default = TrainingExplorer;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
function TrainingExplorer() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var trainingData = (0, hooks_1.useRouteData)(path_1.path.to.training(id));
    var permissions = (0, hooks_1.usePermissions)();
    var sortOrderFetcher = (0, react_router_1.useFetcher)();
    var questionDisclosure = (0, react_1.useDisclosure)();
    var deleteQuestionDisclosure = (0, react_1.useDisclosure)();
    var _m = (0, react_2.useState)(null), selectedQuestion = _m[0], setSelectedQuestion = _m[1];
    var questions = (0, react_2.useMemo)(function () { var _a; return (_a = trainingData === null || trainingData === void 0 ? void 0 : trainingData.training.trainingQuestion) !== null && _a !== void 0 ? _a : []; }, [trainingData]);
    var maxSortOrder = (_a = questions.reduce(function (acc, q) { return Math.max(acc, q.sortOrder); }, 0)) !== null && _a !== void 0 ? _a : 0;
    var trainingQuestionInitialValues = {
        id: selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.id,
        trainingId: id,
        question: (_b = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.question) !== null && _b !== void 0 ? _b : "",
        type: (_c = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.type) !== null && _c !== void 0 ? _c : "MultipleChoice",
        sortOrder: (_d = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.sortOrder) !== null && _d !== void 0 ? _d : maxSortOrder + 1,
        required: (_e = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.required) !== null && _e !== void 0 ? _e : true,
        options: (_f = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.options) !== null && _f !== void 0 ? _f : [],
        correctAnswers: (_g = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.correctAnswers) !== null && _g !== void 0 ? _g : [],
        correctBoolean: (_h = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.correctBoolean) !== null && _h !== void 0 ? _h : false,
        matchingPairs: (selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.matchingPairs)
            ? JSON.stringify(selectedQuestion.matchingPairs)
            : "[]",
        correctNumber: (_j = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.correctNumber) !== null && _j !== void 0 ? _j : undefined,
        tolerance: (_k = selectedQuestion === null || selectedQuestion === void 0 ? void 0 : selectedQuestion.tolerance) !== null && _k !== void 0 ? _k : undefined
    };
    var isDisabled = ((_l = trainingData === null || trainingData === void 0 ? void 0 : trainingData.training) === null || _l === void 0 ? void 0 : _l.status) !== "Draft";
    var _o = (0, react_2.useState)(Array.isArray(questions)
        ? questions.sort(function (a, b) { return a.sortOrder - b.sortOrder; }).map(function (q) { return q.id; })
        : []), sortOrder = _o[0], setSortOrder = _o[1];
    (0, react_2.useEffect)(function () {
        if (Array.isArray(questions)) {
            var sorted = __spreadArray([], questions, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                .map(function (q) { return q.id; });
            setSortOrder(sorted);
        }
    }, [questions]);
    var onReorder = function (newOrder) {
        if (isDisabled)
            return;
        var updates = {};
        newOrder.forEach(function (id, index) {
            updates[id] = index + 1;
        });
        setSortOrder(newOrder);
        updateSortOrder(updates);
    };
    var updateSortOrder = (0, react_1.useDebounce)(function (updates) {
        var formData = new FormData();
        formData.append("updates", JSON.stringify(updates));
        sortOrderFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.trainingQuestionOrder(id)
        });
    }, 2500, true);
    var onDeleteQuestion = function (question) {
        if (isDisabled)
            return;
        setSelectedQuestion(question);
        deleteQuestionDisclosure.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedQuestion(null);
        deleteQuestionDisclosure.onClose();
    };
    var onEditQuestion = function (question) {
        if (isDisabled)
            return;
        (0, react_dom_1.flushSync)(function () {
            setSelectedQuestion(question);
        });
        questionDisclosure.onOpen();
    };
    var newQuestionRef = (0, react_2.useRef)(null);
    (0, react_1.useKeyboardShortcuts)({
        "Command+Shift+a": function (event) {
            var _a;
            event.stopPropagation();
            if (!isDisabled) {
                (_a = newQuestionRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }
        }
    });
    var questionMap = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = questions.reduce(function (acc, q) {
            var _a;
            return (__assign(__assign({}, acc), (_a = {}, _a[q.id] = q, _a)));
        }, {})) !== null && _a !== void 0 ? _a : {};
    }, [questions]);
    return (<>
      <react_1.VStack className="w-full h-[calc(100dvh-99px)] justify-between">
        <react_1.VStack className="w-full flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" spacing={0}>
          {questions && questions.length > 0 ? (<framer_motion_1.Reorder.Group axis="y" values={sortOrder} onReorder={onReorder} className="w-full" disabled={isDisabled}>
              {sortOrder.map(function (sortId) { return (<DraggableStepItem key={sortId} stepId={sortId} isDisabled={isDisabled}>
                  {function (dragControls) { return (<TrainingQuestionItem isDisabled={isDisabled} question={questionMap[sortId]} onDelete={onDeleteQuestion} onEdit={onEditQuestion} dragControls={dragControls}/>); }}
                </DraggableStepItem>); })}
            </framer_motion_1.Reorder.Group>) : (<components_1.Empty>
              {permissions.can("update", "resources") && (<react_1.Button isDisabled={isDisabled} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={function () {
                    (0, react_dom_1.flushSync)(function () {
                        setSelectedQuestion(null);
                    });
                    questionDisclosure.onOpen();
                }}>
                  <macro_1.Trans>Add Question</macro_1.Trans>
                </react_1.Button>)}
            </components_1.Empty>)}
        </react_1.VStack>
        <div className="w-full flex-none border-t border-border p-4">
          <react_1.Tooltip>
            <react_1.TooltipTrigger className="w-full">
              <react_1.Button ref={newQuestionRef} className="w-full" isDisabled={isDisabled || !permissions.can("update", "resources")} leftIcon={<lu_1.LuCirclePlus />} variant="secondary" onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedQuestion(null);
            });
            questionDisclosure.onOpen();
        }}>
                Add Question
              </react_1.Button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>
                <span>
                  <macro_1.Trans>Add Question</macro_1.Trans>
                </span>
                <react_1.Kbd>{prettifyShortcut("Command+Shift+a")}</react_1.Kbd>
              </react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </div>
      </react_1.VStack>
      {questionDisclosure.isOpen && (<TrainingQuestionForm 
        // @ts-ignore
        initialValues={trainingQuestionInitialValues} isDisabled={isDisabled} onClose={questionDisclosure.onClose}/>)}
      {deleteQuestionDisclosure.isOpen && selectedQuestion && (<DeleteTrainingQuestion question={selectedQuestion} onCancel={onDeleteCancel}/>)}
    </>);
}
function TrainingQuestionTypeIcon(_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case "MultipleChoice":
            return <lu_1.LuCircleDot className={className}/>;
        case "TrueFalse":
            return <lu_1.LuToggleLeft className={className}/>;
        case "MultipleAnswers":
            return <lu_1.LuSquareCheck className={className}/>;
        case "MatchingPairs":
            return <lu_1.LuArrowRightLeft className={className}/>;
        case "Numerical":
            return <lu_1.LuHash className={className}/>;
        default:
            return null;
    }
}
function DraggableStepItem(_a) {
    var stepId = _a.stepId, isDisabled = _a.isDisabled, children = _a.children;
    var dragControls = (0, framer_motion_1.useDragControls)();
    return (<framer_motion_1.Reorder.Item key={stepId} value={stepId} dragListener={false} dragControls={dragControls}>
      {children(dragControls)}
    </framer_motion_1.Reorder.Item>);
}
function TrainingQuestionItem(_a) {
    var _b, _c, _d, _e;
    var question = _a.question, isDisabled = _a.isDisabled, onEdit = _a.onEdit, onDelete = _a.onDelete, dragControls = _a.dragControls;
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var permissions = (0, hooks_1.usePermissions)();
    if (!question || !question.id || !question.question)
        return null;
    return (<react_1.HStack className={(0, react_1.cn)("group w-full p-2 items-center hover:bg-accent/30 relative border-b bg-card")}>
      {!isDisabled && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" disabled={isDisabled} className="cursor-grab active:cursor-grabbing" onPointerDown={function (e) {
                if (!isDisabled && dragControls)
                    dragControls.start(e);
            }} style={{ touchAction: "none" }}/>)}
      <react_1.VStack spacing={0} className="flex-grow">
        <react_1.HStack>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <TrainingQuestionTypeIcon type={question.type} className="flex-shrink-0"/>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent side="top">
              <p className="text-foreground text-sm">{question.type}</p>
            </react_1.TooltipContent>
          </react_1.Tooltip>
          <react_1.VStack spacing={0} className="flex-grow">
            <react_1.HStack>
              <p className="text-foreground text-sm">{question.question}</p>
            </react_1.HStack>
            <p className="text-muted-foreground text-xs">
              {question.type === "MultipleChoice" &&
            "".concat((_c = (_b = question.correctAnswers) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "None")}
              {question.type === "TrueFalse" &&
            "".concat(question.correctBoolean ? "True" : "False")}
              {question.type === "MultipleAnswers" &&
            "".concat((_e = (_d = question.correctAnswers) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0, " correct answers")}
              {question.type === "MatchingPairs" && "Matching pairs"}
              {question.type === "Numerical" && "".concat(question.correctNumber)}
            </p>
          </react_1.VStack>
        </react_1.HStack>
      </react_1.VStack>
      {!isDisabled && (<div className="absolute right-2">
          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More"], ["More"])))} className="opacity-0 group-hover:opacity-100 group-active:opacity-100 data-[state=open]:opacity-100" icon={<lu_1.LuEllipsisVertical />} variant="solid" onClick={function (e) { return e.stopPropagation(); }}/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent>
              <react_1.DropdownMenuItem onClick={function (e) {
                e.stopPropagation();
                onEdit(question);
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                <macro_1.Trans>Edit Question</macro_1.Trans>
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem destructive disabled={!permissions.can("update", "resources")} onClick={function (e) {
                e.stopPropagation();
                onDelete(question);
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                <macro_1.Trans>Delete Question</macro_1.Trans>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </div>)}
    </react_1.HStack>);
}
function DeleteTrainingQuestion(_a) {
    var _b;
    var question = _a.question, onCancel = _a.onCancel;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    if (!question.id)
        return null;
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteTrainingQuestion(id, question.id)} name={(_b = question.question) !== null && _b !== void 0 ? _b : "this question"} text={"Are you sure you want to delete this question? This cannot be undone."} onCancel={onCancel} onSubmit={onCancel}/>);
}
function TrainingQuestionForm(_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, isDisabled = _a.isDisabled, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var trainingId = (0, react_router_1.useParams)().id;
    if (!trainingId)
        throw new Error("id not found");
    var _f = (0, react_2.useState)(initialValues.type), type = _f[0], setType = _f[1];
    var _g = (0, react_2.useState)((_b = initialValues.correctBoolean) !== null && _b !== void 0 ? _b : false), correctBoolean = _g[0], setCorrectBoolean = _g[1];
    var _h = (0, react_2.useState)(function () {
        var _a;
        try {
            if (typeof initialValues.matchingPairs === "string") {
                return JSON.parse(initialValues.matchingPairs || "[]");
            }
            return (_a = initialValues.matchingPairs) !== null && _a !== void 0 ? _a : [];
        }
        catch (_b) {
            return [];
        }
    }), matchingPairs = _h[0], setMatchingPairs = _h[1];
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success, onClose]);
    var typeOptions = (0, react_2.useMemo)(function () {
        return resources_1.trainingQuestionType.map(function (t) { return ({
            label: (<react_1.HStack>
            <TrainingQuestionTypeIcon type={t} className="mr-2"/>
            {t === "MultipleChoice"
                    ? "Multiple Choice"
                    : t === "TrueFalse"
                        ? "True/False"
                        : t === "MultipleAnswers"
                            ? "Multiple Answers"
                            : t === "MatchingPairs"
                                ? "Matching Pairs"
                                : "Numerical"}
          </react_1.HStack>),
            value: t
        }); });
    }, []);
    var isEditing = !!initialValues.id;
    var addMatchingPair = function () {
        setMatchingPairs(__spreadArray(__spreadArray([], matchingPairs, true), [{ left: "", right: "" }], false));
    };
    var removeMatchingPair = function (index) {
        setMatchingPairs(matchingPairs.filter(function (_, i) { return i !== index; }));
    };
    var updateMatchingPair = function (index, field, value) {
        var updated = __spreadArray([], matchingPairs, true);
        updated[index][field] = value;
        setMatchingPairs(updated);
    };
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.DrawerContent position="left">
        <form_1.ValidatedForm method="post" action={isEditing
            ? path_1.path.to.trainingQuestion(trainingId, initialValues.id)
            : path_1.path.to.newTrainingQuestion(trainingId)} defaultValues={initialValues} validator={resources_1.trainingQuestionValidator} fetcher={fetcher} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Question</macro_1.Trans>) : (<macro_1.Trans>Add Question</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <form_1.Hidden name="trainingId"/>
            <form_1.Hidden name="sortOrder"/>
            <form_1.Hidden name="id"/>
            <form_1.Hidden name="correctBoolean" value={String(correctBoolean)}/>
            <form_1.Hidden name="matchingPairs" value={JSON.stringify(matchingPairs)}/>
            <react_1.VStack spacing={4}>
              <form_1.SelectControlled name="type" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Type"], ["Type"])))} options={typeOptions} value={type} onChange={function (option) {
            if (option) {
                setType(option.value);
            }
        }}/>
              <form_1.Input name="question" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Question"], ["Question"])))}/>

              {(type === "MultipleChoice" || type === "MultipleAnswers") && (<OptionsWithCorrectAnswers type={type} initialCorrectAnswers={(_d = initialValues.correctAnswers) !== null && _d !== void 0 ? _d : []} initialOptions={(_e = initialValues.options) !== null && _e !== void 0 ? _e : []}/>)}

              {type === "TrueFalse" && (<react_1.VStack spacing={2} className="w-full">
                  <react_1.Label>
                    <macro_1.Trans>Correct Answer</macro_1.Trans>
                  </react_1.Label>
                  <react_1.HStack>
                    <react_1.Switch checked={correctBoolean} onCheckedChange={setCorrectBoolean}/>
                    <span>{correctBoolean ? "True" : "False"}</span>
                  </react_1.HStack>
                </react_1.VStack>)}

              {type === "MatchingPairs" && (<react_1.VStack spacing={2} className="w-full">
                  <react_1.Label>
                    <macro_1.Trans>Matching Pairs</macro_1.Trans>
                  </react_1.Label>
                  {matchingPairs.map(function (pair, index) { return (<react_1.HStack key={index} className="w-full">
                      <form_1.Input name={"pair-left-".concat(index)} placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Left item"], ["Left item"])))} value={pair.left} onChange={function (e) {
                    return updateMatchingPair(index, "left", e.target.value);
                }}/>
                      <form_1.Input name={"pair-right-".concat(index)} placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Right item"], ["Right item"])))} value={pair.right} onChange={function (e) {
                    return updateMatchingPair(index, "right", e.target.value);
                }}/>
                      <react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Remove pair"], ["Remove pair"])))} icon={<lu_1.LuTrash />} variant="ghost" onClick={function () { return removeMatchingPair(index); }}/>
                    </react_1.HStack>); })}
                  <react_1.Button variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addMatchingPair} type="button">
                    <macro_1.Trans>Add Pair</macro_1.Trans>
                  </react_1.Button>
                </react_1.VStack>)}

              {type === "Numerical" && (<>
                  <form_1.Number name="correctNumber" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Correct Answer"], ["Correct Answer"])))}/>
                  <form_1.Number name="tolerance" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Tolerance (+/-)"], ["Tolerance (+/-)"])))} helperText={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Leave empty for exact match"], ["Leave empty for exact match"])))}/>
                </>)}
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.Submit>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
// This component must be inside ValidatedForm to use useFormContext
function OptionsWithCorrectAnswers(_a) {
    var _b;
    var type = _a.type, initialCorrectAnswers = _a.initialCorrectAnswers, initialOptions = _a.initialOptions;
    var t = (0, macro_1.useLingui)().t;
    var getValues = (0, form_1.useFormContext)().getValues;
    var _c = (0, react_2.useState)(initialOptions), options = _c[0], setOptions = _c[1];
    var _d = (0, react_2.useState)((_b = initialCorrectAnswers[0]) !== null && _b !== void 0 ? _b : ""), correctAnswer = _d[0], setCorrectAnswer = _d[1];
    var _e = (0, react_2.useState)(initialCorrectAnswers), correctAnswers = _e[0], setCorrectAnswers = _e[1];
    // Poll for option changes from the form
    (0, react_2.useEffect)(function () {
        var interval = setInterval(function () {
            var formData = getValues();
            var newOptions = [];
            var i = 0;
            while (formData.has("options[".concat(i, "]"))) {
                var value = formData.get("options[".concat(i, "]"));
                if (value)
                    newOptions.push(value);
                i++;
            }
            // Only update if options actually changed
            if (JSON.stringify(newOptions) !== JSON.stringify(options)) {
                setOptions(newOptions);
            }
        }, 300);
        return function () { return clearInterval(interval); };
    }, [getValues, options]);
    // Convert options array to select options format, filtering empty strings
    var answerOptions = (0, react_2.useMemo)(function () {
        return options
            .filter(function (opt) { return opt && opt.trim() !== ""; })
            .map(function (opt) { return ({
            value: opt,
            label: opt
        }); });
    }, [options]);
    // When options change, filter out any correct answers that are no longer valid
    (0, react_2.useEffect)(function () {
        var validOptions = options.filter(function (opt) { return opt && opt.trim() !== ""; });
        if (type === "MultipleChoice") {
            if (correctAnswer && !validOptions.includes(correctAnswer)) {
                setCorrectAnswer("");
            }
        }
        else if (type === "MultipleAnswers") {
            var validAnswers = correctAnswers.filter(function (ans) {
                return validOptions.includes(ans);
            });
            if (validAnswers.length !== correctAnswers.length) {
                setCorrectAnswers(validAnswers);
            }
        }
    }, [options, type, correctAnswer, correctAnswers]);
    return (<>
      <Form_1.Array name="options" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Options"], ["Options"])))}/>

      {type === "MultipleChoice" && (<form_1.Select name="correctAnswers" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Correct Answer"], ["Correct Answer"])))} options={answerOptions} value={correctAnswer} onChange={function (option) {
                var _a;
                setCorrectAnswer((_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : "");
            }} helperText={answerOptions.length === 0 ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Add options above first"], ["Add options above first"]))) : undefined}/>)}

      {type === "MultipleAnswers" && (<form_1.MultiSelect name="correctAnswers" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Correct Answers"], ["Correct Answers"])))} options={answerOptions} value={correctAnswers} onChange={function (selected) {
                setCorrectAnswers(selected.map(function (s) { return s.value; }));
            }} helperText={answerOptions.length === 0 ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Add options above first"], ["Add options above first"]))) : undefined}/>)}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
