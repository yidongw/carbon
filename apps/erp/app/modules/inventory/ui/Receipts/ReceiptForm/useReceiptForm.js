"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useReceiptForm;
var auth_1 = require("@carbon/auth");
var react_1 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
function useReceiptForm(_a) {
    var _b, _c, _d, _e;
    var status = _a.status, initialValues = _a.initialValues;
    var receiptId = (0, react_router_1.useParams)().receiptId;
    if (!receiptId)
        throw new Error("receiptId not found");
    var user = (0, hooks_1.useUser)();
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _g = (0, react_1.useState)((_c = (_b = initialValues.locationId) !== null && _b !== void 0 ? _b : user.defaults.locationId) !== null && _c !== void 0 ? _c : null), locationId = _g[0], setLocationId = _g[1];
    var _h = (0, react_1.useState)((_d = initialValues.supplierId) !== null && _d !== void 0 ? _d : null), supplierId = _h[0], setSupplierId = _h[1];
    var _j = (0, react_1.useState)(function () {
        return status === "Posted"
            ? [
                {
                    id: initialValues.sourceDocumentId,
                    name: initialValues.sourceDocumentReadableId
                }
            ]
            : [];
    }), sourceDocuments = _j[0], setSourceDocuments = _j[1];
    var _k = (0, react_1.useState)((_e = initialValues.sourceDocument) !== null && _e !== void 0 ? _e : "Purchase Order"), sourceDocument = _k[0], setSourceDocument = _k[1];
    var fetchSourceDocuments = (0, react_1.useCallback)(function () {
        if (!carbon || !user.company.id)
            return;
        switch (sourceDocument) {
            case "Purchase Order":
                carbon === null || carbon === void 0 ? void 0 : carbon.from("purchaseOrder").select("id, purchaseOrderId").eq("companyId", user.company.id).or("status.eq.To Receive, status.eq.To Receive and Invoice").then(function (response) {
                    if (response.error) {
                        setError(response.error.message);
                    }
                    else {
                        setSourceDocuments(response.data.map(function (d) { return ({
                            name: d.purchaseOrderId,
                            id: d.id
                        }); }));
                    }
                });
                break;
            case "Inbound Transfer":
                carbon === null || carbon === void 0 ? void 0 : carbon.from("warehouseTransfer").select("id, transferId").eq("companyId", user.company.id).or("status.eq.To Ship and Receive, status.eq.To Receive, status.eq.To Ship").then(function (response) {
                    if (response.error) {
                        setError(response.error.message);
                    }
                    else {
                        setSourceDocuments(response.data.map(function (d) { return ({
                            name: d.transferId,
                            id: d.id
                        }); }));
                    }
                });
                break;
            default:
                setSourceDocuments([]);
        }
    }, [sourceDocument, carbon, user.company.id]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (status !== "Posted") {
            fetchSourceDocuments();
        }
    }, [sourceDocument, status]);
    return {
        error: error,
        locationId: locationId,
        supplierId: supplierId,
        sourceDocuments: sourceDocuments,
        setLocationId: setLocationId,
        setSourceDocument: setSourceDocument,
        setSupplierId: setSupplierId
    };
}
