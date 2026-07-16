"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Icons_1 = require("~/components/Icons");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var people_1 = require("~/stores/people");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var JournalEntryStatus_1 = require("./JournalEntryStatus");
var defaultColumnVisibility = {
    sourceType: false,
    createdBy: false,
    createdAt: false,
    updatedBy: false,
    updatedAt: false
};
var JournalEntriesTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, primaryAction = _a.primaryAction;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var people = (0, people_1.usePeople)()[0];
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    var _c = (0, react_2.useState)(null), selectedEntry = _c[0], setSelectedEntry = _c[1];
    var deleteModal = (0, react_1.useDisclosure)();
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "journalEntryId",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Journal Entry"], ["Journal Entry"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.journalEntryDetails((_b = row.original.id) === null || _b === void 0 ? void 0 : _b.toString())}>
              {row.original.journalEntryId}
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookmark />
                }
            },
            {
                accessorKey: "postingDate",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Date"], ["Date"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (0, utils_1.formatDate)(row.original.postingDate);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "description",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (<react_1.HStack className="py-1" spacing={2}>
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 p-1">
                <Icons_1.JournalEntrySourceTypeIcon sourceType={(_b = row.original.sourceType) !== null && _b !== void 0 ? _b : "Manual"} className="w-4 h-4 text-[#AAAAAA] dark:text-[#444]"/>
              </div>

              <div className="flex flex-col max-w-[300px] truncate">
                <div className="text-sm line-clamp-1">
                  {row.original.description || "—"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {row.original.sourceType || "—"}
                </div>
              </div>
            </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                accessorKey: "sourceType",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Source"], ["Source"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.sourceType}/>;
                },
                meta: {
                    icon: <lu_1.LuTag />,
                    filter: {
                        type: "static",
                        options: accounting_models_1.journalEntrySourceTypes.map(function (v) { return ({
                            label: <Enumerable_1.Enumerable value={v}/>,
                            value: v
                        }); })
                    }
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<JournalEntryStatus_1.default status={row.original.status}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: accounting_models_1.journalEntryStatuses.map(function (v) { return ({
                            label: <JournalEntryStatus_1.default status={v}/>,
                            value: v
                        }); })
                    },
                    icon: <lu_1.LuStar />
                }
            },
            {
                accessorKey: "totalDebits",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Debits"], ["Debits"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return currencyFormatter.format(Number(row.original.totalDebits));
                },
                meta: {
                    icon: <lu_1.LuCircleDollarSign />
                }
            },
            {
                accessorKey: "totalCredits",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Credits"], ["Credits"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return currencyFormatter.format(Number(row.original.totalCredits));
                },
                meta: {
                    icon: <lu_1.LuCircleDollarSign />
                }
            },
            {
                accessorKey: "createdBy",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: <Enumerable_1.Enumerable value={employee.name}/>
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (0, utils_1.formatDate)(row.original.createdAt);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "updatedBy",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Updated By"], ["Updated By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.updatedBy}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: <Enumerable_1.Enumerable value={employee.name}/>
                        }); })
                    },
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "updatedAt",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Updated At"], ["Updated At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (0, utils_1.formatDate)(row.original.updatedAt);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return defaultColumns;
    }, [currencyFormatter, people.map, t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var isDraft = row.status === "Draft";
        return (<>
            <react_1.MenuItem disabled={!permissions.can("view", "accounting")} onClick={function () {
                var _a;
                navigate(path_1.path.to.journalEntryDetails((_a = row.id) === null || _a === void 0 ? void 0 : _a.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              {isDraft ? "Edit Journal Entry" : "View Journal Entry"}
            </react_1.MenuItem>
            <react_1.MenuItem disabled={!isDraft || !permissions.can("delete", "accounting")} destructive onClick={function () {
                setSelectedEntry(row);
                deleteModal.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              Delete Journal Entry
            </react_1.MenuItem>
          </>);
    }, [deleteModal, navigate, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} defaultColumnVisibility={defaultColumnVisibility} primaryAction={primaryAction} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Journal Entries"], ["Journal Entries"])))}/>
        {selectedEntry && selectedEntry.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteJournalEntry(selectedEntry.id.toString())} isOpen={deleteModal.isOpen} name={(_b = selectedEntry.journalEntryId) !== null && _b !== void 0 ? _b : ""} text={"Are you sure you want to delete ".concat(selectedEntry.journalEntryId, "?")} onCancel={function () {
                deleteModal.onClose();
                setSelectedEntry(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedEntry(null);
            }}/>)}
      </>);
});
JournalEntriesTable.displayName = "JournalEntriesTable";
exports.default = JournalEntriesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
