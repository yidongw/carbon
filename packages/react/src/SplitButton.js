"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitButton = void 0;
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Button_1 = require("./Button");
var Dropdown_1 = require("./Dropdown");
var cn_1 = require("./utils/cn");
var SplitButton = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, onClick = _a.onClick, leftIcon = _a.leftIcon, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, size = _a.size, isLoading = _a.isLoading, isDisabled = _a.isDisabled, className = _a.className, dropdownItems = _a.dropdownItems;
    return (<div className="flex">
        <Button_1.Button ref={ref} onClick={onClick} leftIcon={leftIcon} variant={variant} size={size} isLoading={isLoading} isDisabled={isDisabled} className={(0, cn_1.cn)("rounded-r-none before:rounded-r-none hover:scale-100 focus-visible:scale-100", className)}>
          {children}
        </Button_1.Button>
        <Dropdown_1.DropdownMenu>
          <Dropdown_1.DropdownMenuTrigger asChild>
            <Button_1.Button variant={variant} size={size} isDisabled={isDisabled || isLoading} className={(0, cn_1.cn)("rounded-l-none border-l px-1 before:rounded-l-none border-none shadow-none", variant === "primary" &&
            "dark:shadow-[inset_0px_0.5px_0px_rgb(255_255_255_/_0.32)] dark:hover:shadow-button-primary hover:scale-100 focus-visible:scale-100")}>
              <lu_1.LuChevronDown />
            </Button_1.Button>
          </Dropdown_1.DropdownMenuTrigger>
          <Dropdown_1.DropdownMenuContent>
            {dropdownItems.map(function (item, index) { return (<Dropdown_1.DropdownMenuItem key={index} onClick={item.onClick} disabled={item.disabled}>
                {item.icon && <Dropdown_1.DropdownMenuIcon icon={item.icon}/>}
                {item.label}
              </Dropdown_1.DropdownMenuItem>); })}
          </Dropdown_1.DropdownMenuContent>
        </Dropdown_1.DropdownMenu>
      </div>);
});
exports.SplitButton = SplitButton;
SplitButton.displayName = "SplitButton";
