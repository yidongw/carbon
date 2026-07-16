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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptInputModelSelectValue = exports.PromptInputModelSelectItem = exports.PromptInputModelSelectContent = exports.PromptInputModelSelectTrigger = exports.PromptInputModelSelect = exports.PromptInputSubmit = exports.PromptInputActionMenuItem = exports.PromptInputActionMenuContent = exports.PromptInputActionMenuTrigger = exports.PromptInputActionMenu = exports.PromptInputButton = exports.PromptInputTools = exports.PromptInputToolbar = exports.PromptInputTextarea = exports.PromptInputBody = exports.PromptInput = exports.PromptInputActionAddAttachments = exports.usePromptInputAttachments = void 0;
exports.PromptInputAttachment = PromptInputAttachment;
exports.PromptInputAttachments = PromptInputAttachments;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var AttachmentsContext = (0, react_2.createContext)(null);
var usePromptInputAttachments = function () {
    var context = (0, react_2.useContext)(AttachmentsContext);
    if (!context) {
        throw new Error("usePromptInputAttachments must be used within a PromptInput");
    }
    return context;
};
exports.usePromptInputAttachments = usePromptInputAttachments;
function PromptInputAttachment(_a) {
    var _b;
    var data = _a.data, className = _a.className, props = __rest(_a, ["data", "className"]);
    var t = (0, macro_1.useLingui)().t;
    var attachments = (0, exports.usePromptInputAttachments)();
    return (<div className={(0, react_1.cn)("group relative h-14 w-14 border", className)} key={data.id} {...props}>
      {((_b = data.mediaType) === null || _b === void 0 ? void 0 : _b.startsWith("image/")) && data.url ? (<img alt={data.filename || "attachment"} className="size-full object-cover" height={56} src={data.url} width={56}/>) : (<div className="flex size-full items-center justify-center text-muted-foreground">
          <lu_1.LuPaperclip className="size-4"/>
        </div>)}
      <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Remove attachment"], ["Remove attachment"])))} icon={<lu_1.LuX />} className="-right-1.5 -top-1.5 absolute h-6 w-6 rounded-full opacity-0 group-hover:opacity-100" onClick={function () { return attachments.remove(data.id); }} variant="secondary" size="sm"/>
    </div>);
}
function PromptInputAttachments(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    var attachments = (0, exports.usePromptInputAttachments)();
    var _b = (0, react_2.useState)(0), height = _b[0], setHeight = _b[1];
    var contentRef = (0, react_2.useRef)(null);
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        var el = contentRef.current;
        if (!el) {
            return;
        }
        var ro = new ResizeObserver(function () {
            setHeight(el.getBoundingClientRect().height);
        });
        ro.observe(el);
        setHeight(el.getBoundingClientRect().height);
        return function () { return ro.disconnect(); };
    }, []);
    return (<div aria-live="polite" className={(0, react_1.cn)("overflow-hidden transition-[height] duration-200 ease-out", className)} style={{ height: attachments.files.length ? height : 0 }} {...props}>
      <div className="flex flex-wrap gap-2 p-3 pt-3" ref={contentRef}>
        {attachments.files.map(function (file) { return (<react_2.Fragment key={file.id}>{children(file)}</react_2.Fragment>); })}
      </div>
    </div>);
}
var PromptInputActionAddAttachments = function (_a) {
    var props = __rest(_a, []);
    var t = (0, macro_1.useLingui)().t;
    var attachments = (0, exports.usePromptInputAttachments)();
    return (
    // @ts-expect-error
    <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add attachments"], ["Add attachments"])))} variant="ghost" type="button" {...props} icon={<lu_1.LuPaperclip />} onClick={function () { return attachments.openFileDialog(); }}/>);
};
exports.PromptInputActionAddAttachments = PromptInputActionAddAttachments;
var PromptInput = function (_a) {
    var className = _a.className, accept = _a.accept, multiple = _a.multiple, globalDrop = _a.globalDrop, syncHiddenInput = _a.syncHiddenInput, maxFiles = _a.maxFiles, maxFileSize = _a.maxFileSize, onError = _a.onError, onSubmit = _a.onSubmit, props = __rest(_a, ["className", "accept", "multiple", "globalDrop", "syncHiddenInput", "maxFiles", "maxFileSize", "onError", "onSubmit"]);
    var _b = (0, react_2.useState)([]), items = _b[0], setItems = _b[1];
    var inputRef = (0, react_2.useRef)(null);
    var anchorRef = (0, react_2.useRef)(null);
    var formRef = (0, react_2.useRef)(null);
    // Find nearest form to scope drag & drop
    (0, react_2.useEffect)(function () {
        var _a;
        var root = (_a = anchorRef.current) === null || _a === void 0 ? void 0 : _a.closest("form");
        if (root instanceof HTMLFormElement) {
            formRef.current = root;
        }
    }, []);
    var openFileDialog = (0, react_2.useCallback)(function () {
        var _a;
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    }, []);
    var matchesAccept = (0, react_2.useCallback)(function (f) {
        if (!accept || accept.trim() === "") {
            return true;
        }
        // Simple check: if accept includes "image/*", filter to images; otherwise allow.
        if (accept.includes("image/*")) {
            return f.type.startsWith("image/");
        }
        return true;
    }, [accept]);
    var add = (0, react_2.useCallback)(function (files) {
        var incoming = Array.from(files);
        var accepted = incoming.filter(function (f) { return matchesAccept(f); });
        if (accepted.length === 0) {
            onError === null || onError === void 0 ? void 0 : onError({
                code: "accept",
                message: "No files match the accepted types."
            });
            return;
        }
        var withinSize = function (f) {
            return maxFileSize ? f.size <= maxFileSize : true;
        };
        var sized = accepted.filter(withinSize);
        if (sized.length === 0 && accepted.length > 0) {
            onError === null || onError === void 0 ? void 0 : onError({
                code: "max_file_size",
                message: "All files exceed the maximum size."
            });
            return;
        }
        setItems(function (prev) {
            var capacity = typeof maxFiles === "number"
                ? Math.max(0, maxFiles - prev.length)
                : undefined;
            var capped = typeof capacity === "number" ? sized.slice(0, capacity) : sized;
            if (typeof capacity === "number" && sized.length > capacity) {
                onError === null || onError === void 0 ? void 0 : onError({
                    code: "max_files",
                    message: "Too many files. Some were not added."
                });
            }
            var next = [];
            for (var _i = 0, capped_1 = capped; _i < capped_1.length; _i++) {
                var file = capped_1[_i];
                next.push({
                    id: (0, nanoid_1.nanoid)(),
                    type: "file",
                    url: URL.createObjectURL(file),
                    mediaType: file.type,
                    filename: file.name
                });
            }
            return prev.concat(next);
        });
    }, [matchesAccept, maxFiles, maxFileSize, onError]);
    var remove = (0, react_2.useCallback)(function (id) {
        setItems(function (prev) {
            var found = prev.find(function (file) { return file.id === id; });
            if (found === null || found === void 0 ? void 0 : found.url) {
                URL.revokeObjectURL(found.url);
            }
            return prev.filter(function (file) { return file.id !== id; });
        });
    }, []);
    var clear = (0, react_2.useCallback)(function () {
        setItems(function (prev) {
            for (var _i = 0, prev_1 = prev; _i < prev_1.length; _i++) {
                var file = prev_1[_i];
                if (file.url) {
                    URL.revokeObjectURL(file.url);
                }
            }
            return [];
        });
    }, []);
    // Note: File input cannot be programmatically set for security reasons
    // The syncHiddenInput prop is no longer functional
    (0, react_2.useEffect)(function () {
        if (syncHiddenInput && inputRef.current) {
            // Clear the input when items are cleared
            if (items.length === 0) {
                inputRef.current.value = "";
            }
        }
    }, [items, syncHiddenInput]);
    // Attach drop handlers on nearest form and document (opt-in)
    (0, react_2.useEffect)(function () {
        var form = formRef.current;
        if (!form) {
            return;
        }
        var onDragOver = function (e) {
            var _a, _b;
            if ((_b = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) === null || _b === void 0 ? void 0 : _b.includes("Files")) {
                e.preventDefault();
            }
        };
        var onDrop = function (e) {
            var _a, _b, _c;
            if ((_b = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) === null || _b === void 0 ? void 0 : _b.includes("Files")) {
                e.preventDefault();
            }
            if (((_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.files) && e.dataTransfer.files.length > 0) {
                add(e.dataTransfer.files);
            }
        };
        form.addEventListener("dragover", onDragOver);
        form.addEventListener("drop", onDrop);
        return function () {
            form.removeEventListener("dragover", onDragOver);
            form.removeEventListener("drop", onDrop);
        };
    }, [add]);
    (0, react_2.useEffect)(function () {
        if (!globalDrop) {
            return;
        }
        var onDragOver = function (e) {
            var _a, _b;
            if ((_b = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) === null || _b === void 0 ? void 0 : _b.includes("Files")) {
                e.preventDefault();
            }
        };
        var onDrop = function (e) {
            var _a, _b, _c;
            if ((_b = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.types) === null || _b === void 0 ? void 0 : _b.includes("Files")) {
                e.preventDefault();
            }
            if (((_c = e.dataTransfer) === null || _c === void 0 ? void 0 : _c.files) && e.dataTransfer.files.length > 0) {
                add(e.dataTransfer.files);
            }
        };
        document.addEventListener("dragover", onDragOver);
        document.addEventListener("drop", onDrop);
        return function () {
            document.removeEventListener("dragover", onDragOver);
            document.removeEventListener("drop", onDrop);
        };
    }, [add, globalDrop]);
    var handleChange = function (event) {
        if (event.currentTarget.files) {
            add(event.currentTarget.files);
        }
    };
    var handleSubmit = function (event) {
        event.preventDefault();
        var files = items.map(function (_a) {
            var item = __rest(_a, []);
            return (__assign({}, item));
        });
        onSubmit({ text: event.currentTarget.message.value, files: files }, event);
    };
    var ctx = (0, react_2.useMemo)(function () { return ({
        files: items.map(function (item) { return (__assign(__assign({}, item), { id: item.id })); }),
        add: add,
        remove: remove,
        clear: clear,
        openFileDialog: openFileDialog,
        fileInputRef: inputRef
    }); }, [items, add, remove, clear, openFileDialog]);
    return (<AttachmentsContext.Provider value={ctx}>
      <span aria-hidden="true" className="hidden" ref={anchorRef}/>
      <input accept={accept} className="hidden" multiple={multiple} onChange={handleChange} ref={inputRef} type="file"/>
      <form className={(0, react_1.cn)("w-full overflow-hidden bg-card rounded-xl border border-foreground/10 ring-[2px] dark:ring-[#1E1E21] ring-[#DADADA]", className)} onSubmit={handleSubmit} {...props}/>
    </AttachmentsContext.Provider>);
};
exports.PromptInput = PromptInput;
var PromptInputBody = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, react_1.cn)(className, "flex flex-col")} {...props}/>);
};
exports.PromptInputBody = PromptInputBody;
exports.PromptInputTextarea = (0, react_2.forwardRef)(function (_a, ref) {
    var onChange = _a.onChange, className = _a.className, _b = _a.placeholder, placeholder = _b === void 0 ? "You can just do things" : _b, props = __rest(_a, ["onChange", "className", "placeholder"]);
    var handleKeyDown = function (e) {
        if (e.key === "Enter") {
            // Don't submit if IME composition is in progress
            if (e.nativeEvent.isComposing) {
                return;
            }
            if (e.shiftKey) {
                // Allow newline
                return;
            }
            // Submit on Enter (without Shift)
            e.preventDefault();
            var form = e.currentTarget.form;
            if (form) {
                form.requestSubmit();
            }
        }
    };
    return (<react_1.Textarea ref={ref} className={(0, react_1.cn)("w-full resize-none rounded-none border-none p-3 pt-4 shadow-none outline-none ring-0 text-base", "field-sizing-content bg-transparent placeholder:text-muted-foreground", "max-h-[55px] min-h-[55px]", "focus-visible:ring-0", className)} name="message" onChange={function (e) {
            onChange === null || onChange === void 0 ? void 0 : onChange(e);
        }} onKeyDown={handleKeyDown} placeholder={placeholder} {...props}/>);
});
var PromptInputToolbar = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, react_1.cn)("flex items-center justify-between px-3 pt-1 pb-2", className)} {...props}/>);
};
exports.PromptInputToolbar = PromptInputToolbar;
var PromptInputTools = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, react_1.cn)("flex items-center gap-0.5", className)} {...props}/>);
};
exports.PromptInputTools = PromptInputTools;
var PromptInputButton = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? "ghost" : _b, className = _a.className, size = _a.size, _c = _a.type, type = _c === void 0 ? "button" : _c, props = __rest(_a, ["variant", "className", "size", "type"]);
    var newSize = (size !== null && size !== void 0 ? size : react_2.Children.count(props.children) > 1) ? "default" : "icon";
    return (<react_1.Button className={(0, react_1.cn)("shrink-0 gap-1.5", variant === "ghost" && "text-muted-foreground", newSize === "default" && "px-3", className)} isIcon={newSize === "icon"} type="button" variant={variant} {...props}/>);
};
exports.PromptInputButton = PromptInputButton;
var PromptInputActionMenu = function (props) { return (<react_1.DropdownMenu {...props}/>); };
exports.PromptInputActionMenu = PromptInputActionMenu;
var PromptInputActionMenuTrigger = function (_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<react_1.DropdownMenuTrigger asChild>
    <exports.PromptInputButton className={className} {...props}>
      {children !== null && children !== void 0 ? children : <lu_1.LuPlus className="size-4"/>}
    </exports.PromptInputButton>
  </react_1.DropdownMenuTrigger>);
};
exports.PromptInputActionMenuTrigger = PromptInputActionMenuTrigger;
var PromptInputActionMenuContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.DropdownMenuContent align="start" className={(0, react_1.cn)(className)} {...props}/>);
};
exports.PromptInputActionMenuContent = PromptInputActionMenuContent;
var PromptInputActionMenuItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.DropdownMenuItem className={(0, react_1.cn)(className)} {...props}/>);
};
exports.PromptInputActionMenuItem = PromptInputActionMenuItem;
var PromptInputSubmit = function (_a) {
    var className = _a.className, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, _c = _a.size, size = _c === void 0 ? "icon" : _c, status = _a.status, children = _a.children, props = __rest(_a, ["className", "variant", "size", "status", "children"]);
    var t = (0, macro_1.useLingui)().t;
    var Icon = <lu_1.LuArrowUp />;
    if (status === "streaming") {
        Icon = <lu_1.LuSquare />;
    }
    else if (status === "error") {
        Icon = <lu_1.LuX />;
    }
    return children ? (<react_1.Button className={(0, react_1.cn)("gap-1.5", className)} type="submit" variant={variant} {...props}>
      {children}
    </react_1.Button>) : (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Submit"], ["Submit"])))} icon={Icon} isRound className="before:rounded-full after:rounded-full" type="submit" variant={variant} {...props}/>);
};
exports.PromptInputSubmit = PromptInputSubmit;
var PromptInputModelSelect = function (props) { return (<react_1.Select {...props}/>); };
exports.PromptInputModelSelect = PromptInputModelSelect;
var PromptInputModelSelectTrigger = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.SelectTrigger className={(0, react_1.cn)("border-none bg-transparent font-medium text-muted-foreground shadow-none transition-colors", 'hover:bg-accent hover:text-foreground [&[aria-expanded="true"]]:bg-accent [&[aria-expanded="true"]]:text-foreground', className)} {...props}/>);
};
exports.PromptInputModelSelectTrigger = PromptInputModelSelectTrigger;
var PromptInputModelSelectContent = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.SelectContent className={(0, react_1.cn)(className)} {...props}/>);
};
exports.PromptInputModelSelectContent = PromptInputModelSelectContent;
var PromptInputModelSelectItem = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.SelectItem className={(0, react_1.cn)(className)} {...props}/>);
};
exports.PromptInputModelSelectItem = PromptInputModelSelectItem;
var PromptInputModelSelectValue = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<react_1.SelectValue className={(0, react_1.cn)(className)} {...props}/>);
};
exports.PromptInputModelSelectValue = PromptInputModelSelectValue;
var templateObject_1, templateObject_2, templateObject_3;
