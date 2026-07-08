import { describe, expect, it, vi } from "vitest";

vi.mock("~/components", () => ({
  EmployeeAvatar: () => null,
  Hyperlink: () => null,
  ItemThumbnail: () => null,
  MethodIcon: () => null,
  TrackingTypeIcon: () => null
}));

vi.mock("~/components/Icons", () => ({
  ReplenishmentSystemIcon: () => null
}));

vi.mock("~/components/InlineEditor", () => ({
  editableCell: () => () => null,
  TagsCell: () => null
}));

import { buildDefaultStylesTableColumns } from "./stylesTableColumns";
import { defaultStylesTableSharedColumnKeys } from "./stylesTableConfig";

describe("defaultStylesTableSharedColumnKeys", () => {
  it("covers the shared item-management columns mirrored from parts", () => {
    expect(defaultStylesTableSharedColumnKeys).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });

  it("builds visible text headers for the default shared columns", () => {
    const columns = buildDefaultStylesTableColumns({
      people: [],
      tags: [],
      itemPostingGroups: [],
      templateOptions: [],
      formatDate: (value) => value,
      translateReplenishment: (value) => value,
      translateMethodType: (value) => value,
      translateTrackingType: (value) => value
    });

    const headers = columns.map((column) => column.header);

    expect(headers).toEqual(
      expect.arrayContaining([
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
      ])
    );
  });
});
