"use strict";
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
exports.default = EmailRecipients;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
var useEmailOptions = function (type) {
    var groupsFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        groupsFetcher.load(path_1.path.to.api.groupsByTypeWithUsers(type));
    });
    var options = (0, react_2.useMemo)(function () {
        var _a;
        if (!((_a = groupsFetcher.data) === null || _a === void 0 ? void 0 : _a.groups))
            return [];
        var opts = [];
        var seenGroupIds = new Set();
        var collectGroupEmails = function (group) {
            var _a, _b;
            var groupEmails = [];
            (_a = group.data.users) === null || _a === void 0 ? void 0 : _a.forEach(function (user) {
                if (user.email)
                    groupEmails.push(user.email);
            });
            (_b = group.children) === null || _b === void 0 ? void 0 : _b.forEach(function (child) {
                groupEmails.push.apply(groupEmails, collectGroupEmails(child));
            });
            return groupEmails;
        };
        var processGroup = function (group) {
            var _a;
            if (seenGroupIds.has(group.data.id))
                return;
            seenGroupIds.add(group.data.id);
            var groupEmails = __spreadArray([], new Set(collectGroupEmails(group)), true);
            if (groupEmails.length > 0) {
                opts.push({
                    type: "group",
                    id: group.data.id,
                    name: group.data.name,
                    emails: groupEmails,
                    memberCount: groupEmails.length
                });
            }
            (_a = group.data.users) === null || _a === void 0 ? void 0 : _a.forEach(function (user) {
                if (user.email) {
                    opts.push({
                        type: "user",
                        id: user.id,
                        name: user.fullName,
                        email: user.email
                    });
                }
            });
        };
        groupsFetcher.data.groups.forEach(processGroup);
        var seenEmails = new Set();
        return opts.filter(function (opt) {
            if (opt.type === "group")
                return true;
            if (seenEmails.has(opt.email))
                return false;
            seenEmails.add(opt.email);
            return true;
        });
    }, [groupsFetcher.data]);
    return options;
};
function EmailRecipients(_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, _b = _a.type, type = _b === void 0 ? "employee" : _b;
    var _c = (0, form_1.useField)(name), error = _c.error, defaultValue = _c.defaultValue, validate = _c.validate, fieldIsOptional = _c.isOptional;
    var _d = (0, react_2.useState)(defaultValue !== null && defaultValue !== void 0 ? defaultValue : []), emails = _d[0], setEmails = _d[1];
    var _e = (0, react_2.useState)(""), inputValue = _e[0], setInputValue = _e[1];
    var _f = (0, react_2.useState)(false), inputError = _f[0], setInputError = _f[1];
    var _g = (0, react_2.useState)(false), open = _g[0], setOpen = _g[1];
    var inputRef = (0, react_2.useRef)(null);
    var options = useEmailOptions(type);
    // Filter options based on search
    var filteredOptions = (0, react_2.useMemo)(function () {
        if (!inputValue.trim())
            return options;
        var search = inputValue.toLowerCase();
        return options.filter(function (opt) {
            if (opt.type === "user") {
                return (opt.name.toLowerCase().includes(search) ||
                    opt.email.toLowerCase().includes(search));
            }
            return opt.name.toLowerCase().includes(search);
        });
    }, [options, inputValue]);
    var addEmail = (0, react_2.useCallback)(function (email) {
        var trimmed = email.trim().toLowerCase();
        if (trimmed && !emails.includes(trimmed)) {
            setEmails(function (prev) { return __spreadArray(__spreadArray([], prev, true), [trimmed], false); });
            validate();
        }
    }, [emails, validate]);
    var addEmails = (0, react_2.useCallback)(function (newEmails) {
        var toAdd = newEmails
            .map(function (e) { return e.trim().toLowerCase(); })
            .filter(function (e) { return e && !emails.includes(e); });
        if (toAdd.length > 0) {
            setEmails(function (prev) { return __spreadArray(__spreadArray([], prev, true), toAdd, true); });
            validate();
        }
    }, [emails, validate]);
    var removeEmail = (0, react_2.useCallback)(function (email) {
        setEmails(function (prev) { return prev.filter(function (e) { return e !== email; }); });
        validate();
    }, [validate]);
    var handleKeyDown = function (e) {
        var _a;
        if (e.key === "Enter") {
            e.preventDefault();
            var value = inputValue.trim();
            if (value) {
                if ((0, form_2.isValidEmail)(value)) {
                    addEmail(value);
                    setInputValue("");
                    setOpen(false);
                    setInputError(false);
                }
                else {
                    setInputError(true);
                }
            }
        }
        else if (e.key === "Escape") {
            setOpen(false);
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.blur();
        }
        else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
            removeEmail(emails[emails.length - 1]);
        }
        else if (e.key === "ArrowDown" && filteredOptions.length > 0) {
            e.preventDefault();
            setOpen(true);
        }
    };
    var handleSelect = function (option) {
        var _a;
        if (option.type === "user") {
            addEmail(option.email);
        }
        else {
            addEmails(option.emails);
        }
        setInputValue("");
        setOpen(false);
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    return (<react_1.FormControl isInvalid={!!error}>
      {label && (<react_1.FormLabel htmlFor={name} isOptional={fieldIsOptional}>
          {label}
        </react_1.FormLabel>)}
      {emails.map(function (email, index) { return (<input key={email} type="hidden" name={"".concat(name, "[").concat(index, "]")} value={email}/>); })}
      <react_1.Popover open={open} onOpenChange={setOpen}>
        <react_1.PopoverTrigger asChild>
          <div className={(0, react_1.cn)("flex flex-wrap gap-1 min-h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text", inputError ? "border-destructive" : "border-input")} onClick={function (e) {
            var _a;
            // Prevent popover toggle, just focus input
            e.preventDefault();
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }}>
            {emails.map(function (email) { return (<react_1.Badge key={email} variant="secondary" className="border border-card shadow-sm">
                {email}
                <react_1.BadgeCloseButton type="button" onClick={function (e) {
                e.stopPropagation();
                e.preventDefault();
                removeEmail(email);
            }}/>
              </react_1.Badge>); })}
            <input ref={inputRef} value={inputValue} onChange={function (e) {
            setInputValue(e.target.value);
            setInputError(false);
            setOpen(true);
        }} onFocus={function () { return setOpen(true); }} onBlur={function (e) {
            // Delay close to allow click on popover items
            var relatedTarget = e.relatedTarget;
            if (!(relatedTarget === null || relatedTarget === void 0 ? void 0 : relatedTarget.closest("[data-radix-popper-content-wrapper]"))) {
                setTimeout(function () { return setOpen(false); }, 150);
            }
        }} onKeyDown={handleKeyDown} placeholder={emails.length === 0 ? "Search or enter email..." : ""} className="flex-1 min-w-[120px] bg-transparent outline-none placeholder:text-muted-foreground"/>
          </div>
        </react_1.PopoverTrigger>
        <react_1.PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" onOpenAutoFocus={function (e) { return e.preventDefault(); }} onCloseAutoFocus={function (e) { return e.preventDefault(); }} onPointerDownOutside={function (e) {
            // Don't close if clicking inside the trigger
            var target = e.target;
            if (target.closest("[data-radix-popper-content-wrapper]")) {
                e.preventDefault();
            }
        }}>
          <react_1.Command shouldFilter={false}>
            <react_1.CommandList>
              <react_1.CommandEmpty>
                {inputValue ? (<span className={(0, react_1.cn)("text-sm", inputError ? "text-destructive" : "text-muted-foreground")}>
                    {(0, form_2.isValidEmail)(inputValue)
                ? "Press Enter to add this email"
                : "Enter a valid email address"}
                  </span>) : (<span className="text-muted-foreground text-sm">
                    Search users or type an email
                  </span>)}
              </react_1.CommandEmpty>
              {filteredOptions.length > 0 && (<react_1.CommandGroup>
                  {filteredOptions.map(function (option) { return (<react_1.CommandItem key={option.type === "user"
                    ? "user-".concat(option.id)
                    : "group-".concat(option.id)} value={option.type === "user"
                    ? "".concat(option.name, " ").concat(option.email)
                    : option.name} onSelect={function () { return handleSelect(option); }} className="cursor-pointer">
                      {option.type === "group" ? (<div className="flex items-center gap-2">
                          <lu_1.LuUsers className="h-4 w-4 text-muted-foreground"/>
                          <div className="flex flex-col">
                            <span>{option.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {option.memberCount} member
                              {option.memberCount !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>) : (<div className="flex flex-col">
                          <span>{option.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.email}
                          </span>
                        </div>)}
                    </react_1.CommandItem>); })}
                </react_1.CommandGroup>)}
            </react_1.CommandList>
          </react_1.Command>
        </react_1.PopoverContent>
      </react_1.Popover>
      {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
}
