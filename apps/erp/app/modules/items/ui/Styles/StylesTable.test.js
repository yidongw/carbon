"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
vitest_1.vi.mock("~/components", function () { return ({
    EmployeeAvatar: function () { return null; },
    Hyperlink: function () { return null; },
    ItemThumbnail: function () { return null; },
    MethodIcon: function () { return null; },
    TrackingTypeIcon: function () { return null; }
}); });
vitest_1.vi.mock("~/components/Icons", function () { return ({
    ReplenishmentSystemIcon: function () { return null; }
}); });
vitest_1.vi.mock("~/components/InlineEditor", function () { return ({
    editableCell: function () { return function () { return null; }; },
    TagsCell: function () { return null; }
}); });
var stylesTableColumns_1 = require("./stylesTableColumns");
var stylesTableConfig_1 = require("./stylesTableConfig");
(0, vitest_1.describe)("defaultStylesTableSharedColumnKeys", function () {
    (0, vitest_1.it)("covers the shared item-management columns mirrored from parts", function () {
        (0, vitest_1.expect)(stylesTableConfig_1.defaultStylesTableSharedColumnKeys).toEqual(vitest_1.expect.arrayContaining([
            "id",
            "templateName",
            "description",
            "replenishmentSystem",
            "defaultMethodType",
            "itemTrackingType",
            "itemPostingGroupId",
            "colorCode",
            "tags",
            "active"
        ]));
    });
    (0, vitest_1.it)("builds visible text headers for the default shared columns", function () {
        var columns = (0, stylesTableColumns_1.buildDefaultStylesTableColumns)({
            people: [],
            tags: [],
            itemPostingGroups: [],
            templateOptions: [],
            formatDate: function (value) { return value; },
            translateReplenishment: function (value) { return value; },
            translateMethodType: function (value) { return value; },
            translateTrackingType: function (value) { return value; }
        });
        var headers = columns.map(function (column) { return column.header; });
        (0, vitest_1.expect)(headers).toEqual(vitest_1.expect.arrayContaining([
            "Style ID",
            "Template",
            "Description",
            "Replenishment",
            "Default Method",
            "Tracking",
            "Item Group",
            "Color",
            "Tags",
            "Active",
            "Created By",
            "Created At",
            "Updated By",
            "Updated At"
        ]));
    });
});
