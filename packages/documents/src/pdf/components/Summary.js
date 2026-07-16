"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("@react-pdf/renderer");
var styles = renderer_1.StyleSheet.create({
    summary: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20
    },
    companyDetails: {
        display: "flex",
        flexDirection: "column",
        rowGap: 3,
        fontSize: 11,
        fontWeight: 500,
        width: "60%"
    },
    companyName: {
        fontSize: 13,
        letterSpacing: -0.5,
        color: "#000000",
        fontWeight: 700
    },
    documentSummary: {
        display: "flex",
        flexDirection: "column",
        rowGap: 3,
        fontSize: 11,
        fontWeight: 500,
        width: "40%"
    },
    documentSummaryItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 5
    },
    documentSummaryLabel: {
        color: "#7d7d7d",
        fontWeight: 700,
        width: "50%"
    },
    documentSummaryValue: {
        fontWeight: 500
    }
});
var Summary = function (_a) {
    var company = _a.company, items = _a.items;
    return (<renderer_1.View style={styles.summary}>
      <renderer_1.View style={styles.companyDetails}>
        <renderer_1.Text style={styles.companyName}>{company.name}</renderer_1.Text>
        {company.addressLine1 && <renderer_1.Text>{company.addressLine1}</renderer_1.Text>}
        {company.addressLine2 && <renderer_1.Text>{company.addressLine2}</renderer_1.Text>}
        {company.city && <renderer_1.Text>{company.city}</renderer_1.Text>}
        {(company.stateProvince || company.postalCode) && (<renderer_1.Text>
            {[company.stateProvince, company.postalCode]
                .filter(Boolean)
                .join(" ")}
          </renderer_1.Text>)}
        {company.phone && <renderer_1.Text>Phone: {company.phone}</renderer_1.Text>}
        {company.email && <renderer_1.Text>Email: {company.email}</renderer_1.Text>}
        {company.website && <renderer_1.Text>Website: {company.website}</renderer_1.Text>}
      </renderer_1.View>
      <renderer_1.View style={styles.documentSummary}>
        {items.map(function (item) { return (<renderer_1.View key={item.label} style={styles.documentSummaryItem}>
            <renderer_1.Text style={styles.documentSummaryLabel}>{item.label}:</renderer_1.Text>
            <renderer_1.Text style={styles.documentSummaryValue}>{item.value}</renderer_1.Text>
          </renderer_1.View>); })}
      </renderer_1.View>
    </renderer_1.View>);
};
exports.default = Summary;
