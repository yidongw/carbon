import type { I18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { LuArrowRightLeft, LuCircleMinus, LuCirclePlus } from "react-icons/lu";
import { Hyperlink } from "~/components";
import Activity from "~/components/Activity";
import { path } from "~/utils/path";
import type { ItemLedger } from "../../types";

const getActivityText = (ledgerRecord: ItemLedger, i18n: I18n) => {
  switch (ledgerRecord.documentType) {
    case "Purchase Receipt":
      return `received ${ledgerRecord.quantity} units${
        ledgerRecord.storageUnit?.name
          ? ` to ${ledgerRecord.storageUnit.name}`
          : ""
      }${
        ledgerRecord.trackedEntityId
          ? ` from ${
              Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"
            } ${ledgerRecord.trackedEntityId}`
          : ""
      }`;
    case "Purchase Invoice":
      return `invoiced ${ledgerRecord.quantity} units${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Sales Shipment":
      return `shipped ${-1 * ledgerRecord.quantity} units${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }${
        ledgerRecord.trackedEntityId
          ? ` of ${Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"} ${
              ledgerRecord.trackedEntityId
            }`
          : ""
      }`;
    case "Sales Invoice":
      return `invoiced ${ledgerRecord.quantity} units for sale${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Transfer Shipment": {
      const q = -1 * ledgerRecord.quantity;
      const unit = ledgerRecord.storageUnit?.name;
      return unit
        ? i18n._(msg`shipped ${q} units from ${unit} for transfer`)
        : i18n._(msg`shipped ${q} units for transfer`);
    }
    case "Transfer Receipt": {
      const q = ledgerRecord.quantity;
      const unit = ledgerRecord.storageUnit?.name;
      return unit
        ? i18n._(msg`received ${q} units to ${unit} from transfer`)
        : i18n._(msg`received ${q} units from transfer`);
    }
    case "Direct Transfer": {
      const q = Math.abs(ledgerRecord.quantity);
      const unit = ledgerRecord.storageUnit?.name;
      if (!unit) return i18n._(msg`transferred ${q} units`);
      return ledgerRecord.quantity > 0
        ? i18n._(msg`transferred ${q} units to ${unit}`)
        : i18n._(msg`transferred ${q} units from ${unit}`);
    }
    case "Inventory Receipt":
      return `received ${ledgerRecord.quantity} units into inventory${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Inventory Shipment":
      return `shipped ${-1 * ledgerRecord.quantity} units from inventory${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Posted Assembly":
      return `assembled ${ledgerRecord.quantity} units${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Purchase Credit Memo":
      return `credited ${ledgerRecord.quantity} units for purchase${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Purchase Return Shipment":
      return `returned ${ledgerRecord.quantity} units to supplier${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Sales Credit Memo":
      return `credited ${ledgerRecord.quantity} units for sale${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Sales Return Receipt":
      return `received ${ledgerRecord.quantity} units as sales return${
        ledgerRecord.storageUnit?.name
          ? ` to ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Service Credit Memo":
      return `credited ${ledgerRecord.quantity} units for service${
        ledgerRecord.storageUnit?.name
          ? ` on ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Service Invoice":
      return `invoiced ${ledgerRecord.quantity} units for service${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Service Shipment":
      return `shipped ${-1 * ledgerRecord.quantity} units for service${
        ledgerRecord.storageUnit?.name
          ? ` from ${ledgerRecord.storageUnit.name}`
          : ""
      }`;
    case "Job Consumption":
      return (
        <span>
          issued {-1 * ledgerRecord.quantity} units{" "}
          {ledgerRecord.storageUnit?.name
            ? `from ${ledgerRecord.storageUnit.name} `
            : ""}
          {ledgerRecord.trackedEntityId ? (
            <>
              from {Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"}{" "}
              {ledgerRecord.trackedEntityId}{" "}
            </>
          ) : null}
          {ledgerRecord.documentLineId && ledgerRecord.documentId ? (
            <>
              to a{" "}
              <Hyperlink
                className="inline-flex"
                to={`${path.to.jobProductionEvents(
                  ledgerRecord.documentId!
                )}?filter=jobOperationId:eq:${ledgerRecord.documentLineId}`}
              >
                job operation
              </Hyperlink>
            </>
          ) : ledgerRecord.documentId ? (
            <>
              to a{" "}
              <Hyperlink
                className="inline-flex"
                to={path.to.jobDetails(ledgerRecord.documentId!)}
              >
                job
              </Hyperlink>
            </>
          ) : null}
        </span>
      );
    case "Maintenance Consumption":
      return (
        <span>
          issued {-1 * ledgerRecord.quantity} units{" "}
          {ledgerRecord.storageUnit?.name
            ? `from ${ledgerRecord.storageUnit.name} `
            : ""}
          {ledgerRecord.trackedEntityId ? (
            <>
              from {Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"}{" "}
              {ledgerRecord.trackedEntityId}{" "}
            </>
          ) : null}
          {ledgerRecord.documentId ? (
            <>
              to a{" "}
              <Hyperlink
                className="inline-flex"
                to={path.to.maintenanceDispatch(ledgerRecord.documentId!)}
              >
                maintenance dispatch
              </Hyperlink>
            </>
          ) : null}
        </span>
      );
    case "Job Receipt":
      return (
        <>
          <span>
            received {ledgerRecord.quantity} units
            {ledgerRecord.storageUnit?.name
              ? ` to ${ledgerRecord.storageUnit.name}`
              : ""}{" "}
            from a
          </span>{" "}
          <Hyperlink
            className="inline-flex"
            to={path.to.jobDetails(ledgerRecord.documentId!)}
          >
            job
          </Hyperlink>
        </>
      );
    default:
      break;
  }

  switch (ledgerRecord.entryType) {
    case "Positive Adjmt.": {
      const q = ledgerRecord.quantity;
      const unit = ledgerRecord.storageUnit?.name;
      const te = ledgerRecord.trackedEntityId;
      const batch = Math.abs(q) > 1;
      if (unit && te)
        return batch
          ? i18n._(
              msg`made a positive adjustment of ${q} to ${unit} for batch ${te}`
            )
          : i18n._(
              msg`made a positive adjustment of ${q} to ${unit} for serial ${te}`
            );
      if (unit)
        return i18n._(msg`made a positive adjustment of ${q} to ${unit}`);
      if (te)
        return batch
          ? i18n._(msg`made a positive adjustment of ${q} for batch ${te}`)
          : i18n._(msg`made a positive adjustment of ${q} for serial ${te}`);
      return i18n._(msg`made a positive adjustment of ${q}`);
    }
    case "Negative Adjmt.": {
      const q = -1 * ledgerRecord.quantity;
      const unit = ledgerRecord.storageUnit?.name;
      const te = ledgerRecord.trackedEntityId;
      const batch = Math.abs(ledgerRecord.quantity) > 1;
      if (unit && te)
        return batch
          ? i18n._(
              msg`made a negative adjustment of ${q} to ${unit} for batch ${te}`
            )
          : i18n._(
              msg`made a negative adjustment of ${q} to ${unit} for serial ${te}`
            );
      if (unit)
        return i18n._(msg`made a negative adjustment of ${q} to ${unit}`);
      if (te)
        return batch
          ? i18n._(msg`made a negative adjustment of ${q} for batch ${te}`)
          : i18n._(msg`made a negative adjustment of ${q} for serial ${te}`);
      return i18n._(msg`made a negative adjustment of ${q}`);
    }
    default:
      return "";
  }
};

const getActivityIcon = (ledgerRecord: ItemLedger) => {
  switch (ledgerRecord.entryType) {
    case "Transfer":
      return <LuArrowRightLeft className="text-blue-500 w-5 h-5" />;
    case "Positive Adjmt.":
      return <LuCirclePlus className="text-emerald-500 w-5 h-5" />;
    case "Negative Adjmt.":
    case "Consumption":
      return <LuCircleMinus className="text-red-500 w-5 h-5" />;
    default:
      return "";
  }
};

type InventoryActivityProps = {
  item: ItemLedger;
};

const InventoryActivity = ({ item }: InventoryActivityProps) => {
  const { i18n } = useLingui();
  return (
    <Activity
      employeeId={item.createdBy}
      activityMessage={getActivityText(item, i18n)}
      activityTime={item.createdAt}
      activityIcon={getActivityIcon(item)}
      comment={item.comment}
    />
  );
};

export default InventoryActivity;
