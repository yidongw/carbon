"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStartedEmail = void 0;
var components_1 = require("@react-email/components");
var Logo_1 = require("./components/Logo");
var Theme_1 = require("./components/Theme");
var getStartedStyles = "\n  .gs-body {\n    background-color: #f5f5f7;\n    background-image: linear-gradient(180deg, #f5f5f7 0%, #ececef 100%);\n  }\n  .gs-card {\n    background-color: #ffffff;\n    background-image: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);\n    border-color: #e5e7eb !important;\n  }\n  .gs-divider {\n    border-color: #ececef !important;\n  }\n  .gs-row {\n    background-color: #fafafa;\n    border-color: #ececef !important;\n  }\n  .gs-row-title {\n    color: #0e0e0e !important;\n  }\n  .gs-row-desc {\n    color: #6b7280 !important;\n  }\n  .gs-chevron {\n    color: #9ca3af !important;\n  }\n  .gs-cta {\n    background-color: #0e0e0e !important;\n    color: #ffffff !important;\n    border-color: #0e0e0e !important;\n  }\n";
function ResourceLink(_a) {
    var href = _a.href, title = _a.title, description = _a.description;
    return (<components_1.Link href={href} style={{
            textDecoration: "none",
            display: "block"
        }}>
      <components_1.Section className="gs-row" style={{
            backgroundColor: "#fafafa",
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#ececef",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 10
        }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ width: "100%" }}>
          <tr>
            <td style={{ verticalAlign: "middle" }}>
              <components_1.Text className="gs-row-title" style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 500,
            lineHeight: "20px",
            color: "#0e0e0e"
        }}>
                {title}
              </components_1.Text>
              <components_1.Text className="gs-row-desc" style={{
            margin: "4px 0 0 0",
            fontSize: 13,
            lineHeight: "18px",
            color: "#6b7280"
        }}>
                {description}
              </components_1.Text>
            </td>
            <td align="right" width="20" style={{ verticalAlign: "middle", paddingLeft: 12 }}>
              <span className="gs-chevron" style={{
            fontSize: 18,
            color: "#9ca3af",
            fontWeight: 400
        }}>
                ›
              </span>
            </td>
          </tr>
        </table>
      </components_1.Section>
    </components_1.Link>);
}
var GetStartedEmail = function (_a) {
    var _b = _a.firstName, firstName = _b === void 0 ? "Huckleberry" : _b, _c = _a.academyUrl, academyUrl = _c === void 0 ? "https://learn.carbon.ms" : _c;
    var preview = "Hi ".concat(firstName, ", here's how to get the most out of Carbon.");
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    var resources = [
        {
            href: "".concat(academyUrl, "/course/carbon-overview/the-basics"),
            title: "The Basics",
            description: "Tables, forms, documents, and custom fields."
        },
        {
            href: "".concat(academyUrl, "/course/getting-started/setting-up-company"),
            title: "Setting up your company",
            description: "Configure Carbon for your team in minutes."
        },
        {
            href: "".concat(academyUrl, "/course/parts-materials/defining-item"),
            title: "Defining items",
            description: "Define and manage parts, materials, and assemblies."
        },
        {
            href: "".concat(academyUrl, "/course/selling/quoting-estimating"),
            title: "Quoting and estimating",
            description: "Build quotes, estimates, and convert them to orders."
        },
        {
            href: "".concat(academyUrl, "/course/manufacturing/managing-production"),
            title: "Managing production",
            description: "Run jobs end-to-end, from creation to completion."
        },
        {
            href: "".concat(academyUrl, "/course/buying/purchasing-basics"),
            title: "Purchasing basics",
            description: "Manage purchase orders through to receipt."
        },
        {
            href: "".concat(academyUrl, "/course/developing/using-api"),
            title: "Using the API",
            description: "Build custom apps on top of Carbon."
        }
    ];
    return (<Theme_1.EmailThemeProvider preview={<components_1.Preview>{preview}</components_1.Preview>} additionalHeadContent={<style>{getStartedStyles}</style>} disableDarkMode>
      <components_1.Body className={"my-auto mx-auto font-sans gs-body ".concat(themeClasses.body)} style={{
            backgroundColor: "#f5f5f7",
            backgroundImage: "linear-gradient(180deg, #f5f5f7 0%, #ececef 100%)"
        }}>
        <components_1.Container className={"my-[40px] mx-auto p-[36px] max-w-[560px] rounded-[16px] gs-card ".concat(themeClasses.container)} style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 16,
            backgroundColor: "#ffffff",
            backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%)"
        }}>
          <Logo_1.Logo />

          <components_1.Heading className={"text-[24px] font-normal text-center tracking-tight p-0 mt-[40px] mb-[32px] mx-0 ".concat(themeClasses.heading)} style={{ color: lightStyles.text.color }}>
            Get the most out of Carbon
          </components_1.Heading>

          <components_1.Section>
            <components_1.Text className={"text-[15px] leading-[26px] m-0 mb-[24px] ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
              Hi {firstName}, just checking in to help you get started. Here are
              a few things worth exploring today:
            </components_1.Text>
          </components_1.Section>

          <components_1.Section className="text-center mb-[28px]">
            <components_1.Button href={"".concat(academyUrl, "/course/carbon-overview/the-basics")} className="gs-cta" style={{
            backgroundColor: "#0e0e0e",
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            textAlign: "center",
            padding: "12px 22px",
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#0e0e0e",
            display: "inline-block"
        }}>
              Start with The Basics →
            </components_1.Button>
          </components_1.Section>

          <components_1.Section>
            {resources.slice(1).map(function (r) { return (<ResourceLink key={r.href} href={r.href} title={r.title} description={r.description}/>); })}
          </components_1.Section>

          <components_1.Hr className={"my-[32px] gs-divider ".concat(themeClasses.border)} style={{ borderColor: "#ececef" }}/>

          <components_1.Text className={"text-[14px] leading-[22px] m-0 mb-[8px] ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
            Let us know if you have any thoughts or feedback—we'd love to hear
            from you.
          </components_1.Text>

          <components_1.Section className="mt-[20px]">
            <components_1.Text className={"text-[14px] m-0 mb-[2px] ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
              — The Carbon Team
            </components_1.Text>
          </components_1.Section>
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.GetStartedEmail = GetStartedEmail;
exports.default = exports.GetStartedEmail;
