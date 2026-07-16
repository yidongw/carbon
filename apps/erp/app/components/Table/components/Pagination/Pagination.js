"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationButtons = void 0;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var Pagination = function (props) {
    var pageSize = props.pageSize, setPageSize = props.setPageSize;
    var pageSizes = [20, 100, 500, 1000];
    if (!pageSizes.includes(pageSize)) {
        pageSizes.push(pageSize);
        pageSizes.sort();
    }
    return (<>
      <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-zinc-200/0 via-zinc-500/30 to-zinc-200/0"/>
      <react_1.HStack className="text-center bg-card justify-between py-4 w-full z-[1] px-4" spacing={6}>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.Button variant="secondary">
              {pageSize} <macro_1.Trans>rows</macro_1.Trans>
            </react_1.Button>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent align="start" className="w-48">
            <react_1.DropdownMenuLabel>
              <macro_1.Trans>Results per page</macro_1.Trans>
            </react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuRadioGroup value={"".concat(pageSize)}>
              {pageSizes.map(function (size) { return (<react_1.DropdownMenuRadioItem key={"".concat(size)} value={"".concat(size)} onClick={function () {
                setPageSize(size);
            }}>
                  {size}
                </react_1.DropdownMenuRadioItem>); })}
            </react_1.DropdownMenuRadioGroup>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
        <react_1.HStack>
          <exports.PaginationButtons {...props}/>
        </react_1.HStack>
      </react_1.HStack>
    </>);
};
var PaginationButtons = function (_a) {
    var _b = _a.condensed, condensed = _b === void 0 ? false : _b, canNextPage = _a.canNextPage, canPreviousPage = _a.canPreviousPage, count = _a.count, nextPage = _a.nextPage, offset = _a.offset, pageSize = _a.pageSize, previousPage = _a.previousPage;
    var t = (0, macro_1.useLingui)().t;
    var nextButtonRef = (0, react_2.useRef)(null);
    var previousButtonRef = (0, react_2.useRef)(null);
    var prettifyShortcut = (0, react_1.usePrettifyShortcut)();
    var scrollToTop = (0, react_2.useCallback)(function () {
        var _a;
        (_a = document
            .getElementById("table-container")) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    var handlePreviousPage = (0, react_2.useCallback)(function () {
        previousPage();
        scrollToTop();
    }, [previousPage, scrollToTop]);
    var handleNextPage = (0, react_2.useCallback)(function () {
        nextPage();
        scrollToTop();
    }, [nextPage, scrollToTop]);
    (0, react_1.useKeyboardShortcuts)({
        ArrowRight: function (event) {
            var _a;
            event.stopPropagation();
            (_a = nextButtonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        },
        ArrowLeft: function (event) {
            var _a;
            event.stopPropagation();
            (_a = previousButtonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    });
    return (<>
      {condensed ? (<>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Previous"], ["Previous"])))} icon={<bs_1.BsChevronLeft />} isDisabled={!canPreviousPage} onClick={handlePreviousPage} variant="secondary"/>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>{prettifyShortcut("ArrowLeft")}</react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Next"], ["Next"])))} icon={<bs_1.BsChevronRight />} isDisabled={!canNextPage} onClick={handleNextPage} variant="secondary"/>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>{prettifyShortcut("ArrowRight")}</react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </>) : (<>
          <div className="text-foreground text-sm font-medium align-center hidden lg:flex">
            {count > 0 ? offset + 1 : 0} - {Math.min(offset + pageSize, count)}{" "}
            <macro_1.Trans>of</macro_1.Trans> {count}
          </div>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Button ref={previousButtonRef} variant="secondary" isDisabled={!canPreviousPage} onClick={handlePreviousPage} leftIcon={<bs_1.BsChevronLeft />}>
                <macro_1.Trans>Previous</macro_1.Trans>
              </react_1.Button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>{prettifyShortcut("ArrowLeft")}</react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
          <react_1.Tooltip>
            <react_1.TooltipTrigger>
              <react_1.Button ref={nextButtonRef} variant="secondary" isDisabled={!canNextPage} onClick={handleNextPage} rightIcon={<bs_1.BsChevronRight />}>
                <macro_1.Trans>Next</macro_1.Trans>
              </react_1.Button>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent>
              <react_1.HStack>{prettifyShortcut("ArrowRight")}</react_1.HStack>
            </react_1.TooltipContent>
          </react_1.Tooltip>
        </>)}
    </>);
};
exports.PaginationButtons = PaginationButtons;
exports.default = Pagination;
var templateObject_1, templateObject_2;
