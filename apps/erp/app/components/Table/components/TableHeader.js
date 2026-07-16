"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var components_1 = require("~/components");
var ImportCSVModal_1 = require("~/components/ImportCSVModal");
var Navigation_1 = require("~/components/Layout/Navigation");
var hooks_1 = require("~/hooks");
var useSavedViews_1 = require("~/hooks/useSavedViews");
var path_1 = require("~/utils/path");
var Columns_1 = require("./Columns");
var Download_1 = require("./Download");
var Filter_1 = require("./Filter");
var Pagination_1 = require("./Pagination");
var Sort_1 = require("./Sort");
var TableHeader = function (_a) {
    var _b, _c;
    var featuredColumns = _a.featuredColumns, compact = _a.compact, columnAccessors = _a.columnAccessors, columnOrder = _a.columnOrder, columnPinning = _a.columnPinning, columnVisibility = _a.columnVisibility, columns = _a.columns, data = _a.data, editMode = _a.editMode, filters = _a.filters, importCSV = _a.importCSV, onPinnedReorder = _a.onPinnedReorder, primaryAction = _a.primaryAction, pagination = _a.pagination, selectedRows = _a.selectedRows, renderActions = _a.renderActions, setFeaturedColumns = _a.setFeaturedColumns, setColumnOrder = _a.setColumnOrder, setEditMode = _a.setEditMode, table = _a.table, title = _a.title, withInlineEditing = _a.withInlineEditing, withPagination = _a.withPagination, withSavedView = _a.withSavedView, withSearch = _a.withSearch, withSelectableRows = _a.withSelectableRows, sort = _a.sort, filterActions = _a.filterActions;
    var _d = (0, macro_1.useLingui)(), t = _d.t, i18n = _d.i18n;
    var _e = (0, hooks_1.useUrlParams)(), params = _e[0], setParams = _e[1];
    var currentFilters = params.getAll("filter").filter(Boolean);
    var currentSorts = params.getAll("sort").filter(Boolean);
    var _f = (0, react_2.useState)(null), importCSVTable = _f[0], setImportCSVTable = _f[1];
    var savedViewDisclosure = (0, react_1.useDisclosure)();
    var canSaveView = withSavedView && !!table;
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) && fetcher.data.id) {
            setParams({ view: fetcher.data.id });
            savedViewDisclosure.onClose();
        }
        else if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.state, (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    var _g = (0, useSavedViews_1.useSavedViews)(), currentView = _g.currentView, hasView = _g.hasView;
    var translateText = function (value) {
        if (!value)
            return value;
        return i18n._(value);
    };
    var viewTitle = translateText((_c = currentView === null || currentView === void 0 ? void 0 : currentView.name) !== null && _c !== void 0 ? _c : title);
    // const viewDescription = currentView?.description ?? "";
    var savedViewFormValidator = (0, react_2.useMemo)(function () {
        return zod_1.z.object({
            id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
            table: zod_1.z.string(),
            name: zod_1.z.string().min(1, {
                message: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["A name is required to save a view"], ["A name is required to save a view"])))
            }),
            description: zod_1.z.string().optional(),
            filter: zod_1.z.string().optional(),
            sort: zod_1.z.string().optional(),
            state: zod_1.z.string(),
            type: zod_1.z.enum(["Public", "Private"])
        });
    }, [t]);
    var hideTitleBar = !viewTitle && !primaryAction && !canSaveView;
    return (<div className={(0, react_1.cn)("w-full flex flex-col", !compact && "mb-2 md:mb-8")}>
      {canSaveView && savedViewDisclosure.isOpen ? (<form_1.ValidatedForm method="post" action={path_1.path.to.saveViews} validator={savedViewFormValidator} resetAfterSubmit className="w-full px-2 md:px-0" defaultValues={currentView !== null && currentView !== void 0 ? currentView : {}} fetcher={fetcher}>
          <react_1.Card className="my-4">
            <form_1.Hidden name="id" value={currentView === null || currentView === void 0 ? void 0 : currentView.id}/>
            <form_1.Hidden name="state" value={JSON.stringify({
                columnOrder: columnOrder,
                columnPinning: columnPinning,
                columnVisibility: columnVisibility,
                filters: currentFilters,
                sorts: currentSorts
            })}/>
            <form_1.Hidden name="table" value={table}/>
            <form_1.Hidden name="type" value="Private"/>
            <react_1.CardContent>
              <form_1.Input autoFocus name="name" placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["My Saved View"], ["My Saved View"])))} label="" className="font-medium text-base" borderless/>
              <form_1.Input name="description" label="" placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description (optional)"], ["Description (optional)"])))} className="text-sm" borderless/>
            </react_1.CardContent>
            <react_1.CardFooter>
              <react_1.Button variant="secondary" onClick={savedViewDisclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit>
                {hasView ? <macro_1.Trans>Update</macro_1.Trans> : <macro_1.Trans>Save</macro_1.Trans>}
              </form_1.Submit>
            </react_1.CardFooter>
          </react_1.Card>
        </form_1.ValidatedForm>) : (!hideTitleBar && (<react_1.HStack className={(0, react_1.cn)(compact
                ? "px-4 py-2 bg-card border-b w-full"
                : "px-4 md:px-0 py-2 md:py-6 bg-card w-full relative", "flex-nowrap overflow-x-auto justify-end md:justify-between [&::-webkit-scrollbar]:hidden [scrollbar-width:none]")}>
            <react_1.HStack spacing={1} className="hidden md:flex shrink-0">
              <Navigation_1.CollapsibleSidebarTrigger />
              {viewTitle && (<react_1.Heading size={compact ? "h3" : "h2"}>{viewTitle}</react_1.Heading>)}
            </react_1.HStack>

            <react_1.HStack className="shrink-0">
              {/* <Button variant="secondary" leftIcon={<LuDownload />}>
          Export
          </Button> */}
              <>{primaryAction}</>
              {importCSV && (<react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Table actions"], ["Table actions"])))} variant="secondary" icon={<bs_1.BsThreeDotsVertical />}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent align="end">
                    <react_1.DropdownMenuLabel>
                      <macro_1.Trans>Bulk Import</macro_1.Trans>
                    </react_1.DropdownMenuLabel>
                    <react_1.DropdownMenuSeparator />
                    {importCSV.map(function (_a) {
                    var table = _a.table, label = _a.label;
                    return (<react_1.DropdownMenuItem key={table} onClick={function () {
                            setImportCSVTable(table);
                        }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                        {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Import ", " CSV"], ["Import ", " CSV"])), label)}
                      </react_1.DropdownMenuItem>);
                })}
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>)}
            </react_1.HStack>
          </react_1.HStack>))}
      <react_1.HStack className={(0, react_1.cn)(compact
            ? "px-4 py-2 bg-card border-b border-border w-full"
            : "px-4 md:px-0 py-1 bg-card w-full", "flex-nowrap overflow-x-auto md:justify-between [&::-webkit-scrollbar]:hidden [scrollbar-width:none]")}>
        <react_1.HStack className="shrink-0">
          {withSelectableRows &&
            selectedRows.length > 0 &&
            typeof renderActions === "function" && (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button className="pl-2 pr-1" leftIcon={<lu_1.LuCheck />} variant="secondary">
                    <react_1.Badge variant="secondary">
                      <span>{selectedRows.length}</span>
                    </react_1.Badge>
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                {renderActions(selectedRows)}
              </react_1.DropdownMenu>)}
          {withSearch && (<components_1.SearchFilter param="search" size="sm" placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Search"], ["Search"])))}/>)}
          {!!(filters === null || filters === void 0 ? void 0 : filters.length) && <Filter_1.Filter filters={filters}/>}
          {filterActions}
        </react_1.HStack>
        <react_1.HStack className="shrink-0">
          {sort === undefined ? (<Sort_1.default columnAccessors={columnAccessors}/>) : (sort)}

          <Columns_1.default featuredColumns={featuredColumns} columnOrder={columnOrder} columns={columns} onPinnedReorder={onPinnedReorder} setFeaturedColumns={setFeaturedColumns} setColumnOrder={setColumnOrder} withSelectableRows={withSelectableRows}/>

          {canSaveView && (<react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.IconButton aria-label={hasView ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Edit View"], ["Edit View"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Save View"], ["Save View"])))} variant={savedViewDisclosure.isOpen || hasView ? "active" : "ghost"} icon={<lu_1.LuLayers />} onClick={savedViewDisclosure.onToggle}/>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <p>
                  {hasView ? (<macro_1.Trans>Edit View</macro_1.Trans>) : (<macro_1.Trans>Save View</macro_1.Trans>)}
                </p>
              </react_1.TooltipContent>
            </react_1.Tooltip>)}

          <Download_1.default data={data} columnAccessors={columnAccessors} columnOrder={columnOrder} columnVisibility={columnVisibility}/>

          {withPagination &&
            (pagination.canNextPage || pagination.canPreviousPage) && (<Pagination_1.PaginationButtons {...pagination} condensed/>)}

          {withInlineEditing &&
            (editMode ? (<react_1.Button leftIcon={<lu_1.LuLock />} variant="secondary" onClick={function () { return setEditMode(false); }}>
                <macro_1.Trans>Lock</macro_1.Trans>
              </react_1.Button>) : (<react_1.Button leftIcon={<lu_1.LuFilePen />} variant="secondary" onClick={function () { return setEditMode(true); }}>
                <macro_1.Trans>Edit</macro_1.Trans>
              </react_1.Button>))}
        </react_1.HStack>
      </react_1.HStack>
      {currentFilters.length > 0 && (<react_1.HStack className={(0, react_1.cn)(compact
                ? "px-4 py-1.5 justify-between bg-card border-b border-border w-full"
                : "px-4 md:px-0 py-1.5 justify-between bg-card w-full", "flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]")}>
          <Filter_1.ActiveFilters filters={filters}/>
        </react_1.HStack>)}
      {importCSVTable && (<ImportCSVModal_1.ImportCSVModal table={importCSVTable} onClose={function () { return setImportCSVTable(null); }}/>)}
    </div>);
};
exports.default = TableHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
