"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEmail = void 0;
var components_1 = require("@react-email/components");
var Logo_1 = require("./components/Logo");
var Theme_1 = require("./components/Theme");
// Dark-mode-aware styles. Backgrounds are intentionally set via CSS classes
// (not inline styles) so `!important` overrides in dark-mode media queries
// can flip them — inline `style` wins against non-important CSS, but loses to
// `!important`. Most modern clients (Apple Mail, iOS Mail, Gmail web/iOS,
// Outlook web/mobile) honor this; Outlook desktop renders light-mode only,
// matching the rest of the system.
var notificationStyles = "\n  .nf-body {\n    background-color: #f5f5f7;\n    background-image: linear-gradient(180deg, #f5f5f7 0%, #ececef 100%);\n  }\n  .nf-card {\n    background-color: #ffffff;\n    background-image: linear-gradient(180deg, #ffffff 0%, #fbfbfc 100%);\n    border-color: #e5e7eb;\n  }\n  .nf-divider {\n    border-color: #ececef !important;\n  }\n  .nf-eyebrow {\n    color: #6b7280 !important;\n  }\n  .nf-callout {\n    background-color: #fafafa !important;\n    border-color: #ececef !important;\n  }\n  .nf-callout-accent {\n    background-color: #0e0e0e !important;\n  }\n  .nf-cta {\n    background-color: #0e0e0e !important;\n    color: #ffffff !important;\n    border-color: #0e0e0e !important;\n  }\n  .nf-fallback {\n    color: #6b7280 !important;\n  }\n\n  @media (prefers-color-scheme: dark) {\n    .nf-body {\n      background-color: #0C0C0C !important;\n      background-image: linear-gradient(180deg, #0C0C0C 0%, #161618 100%) !important;\n    }\n    .nf-card {\n      background-color: #161618 !important;\n      background-image: linear-gradient(180deg, #161618 0%, #0F0F10 100%) !important;\n      border-color: #1D1D1D !important;\n    }\n    .nf-divider {\n      border-color: #1D1D1D !important;\n    }\n    .nf-eyebrow {\n      color: #a1a1aa !important;\n    }\n    .nf-callout {\n      background-color: #0F0F10 !important;\n      border-color: #1D1D1D !important;\n    }\n    .nf-callout-accent {\n      background-color: #fefefe !important;\n    }\n    .nf-cta {\n      background-color: #fefefe !important;\n      color: #0C0C0C !important;\n      border-color: #fefefe !important;\n    }\n    .nf-fallback {\n      color: #a1a1aa !important;\n    }\n  }\n\n  /* Gmail desktop dark mode targeting */\n  .gmail_dark .nf-body,\n  .gmail_dark_theme .nf-body,\n  [data-darkmode=\"true\"] .nf-body {\n    background-color: #0C0C0C !important;\n    background-image: linear-gradient(180deg, #0C0C0C 0%, #161618 100%) !important;\n  }\n  .gmail_dark .nf-card,\n  .gmail_dark_theme .nf-card,\n  [data-darkmode=\"true\"] .nf-card {\n    background-color: #161618 !important;\n    background-image: linear-gradient(180deg, #161618 0%, #0F0F10 100%) !important;\n    border-color: #1D1D1D !important;\n  }\n  .gmail_dark .nf-divider,\n  .gmail_dark_theme .nf-divider,\n  [data-darkmode=\"true\"] .nf-divider {\n    border-color: #1D1D1D !important;\n  }\n  .gmail_dark .nf-eyebrow,\n  .gmail_dark_theme .nf-eyebrow,\n  [data-darkmode=\"true\"] .nf-eyebrow {\n    color: #a1a1aa !important;\n  }\n  .gmail_dark .nf-callout,\n  .gmail_dark_theme .nf-callout,\n  [data-darkmode=\"true\"] .nf-callout {\n    background-color: #0F0F10 !important;\n    border-color: #1D1D1D !important;\n  }\n  .gmail_dark .nf-callout-accent,\n  .gmail_dark_theme .nf-callout-accent,\n  [data-darkmode=\"true\"] .nf-callout-accent {\n    background-color: #fefefe !important;\n  }\n  .gmail_dark .nf-cta,\n  .gmail_dark_theme .nf-cta,\n  [data-darkmode=\"true\"] .nf-cta {\n    background-color: #fefefe !important;\n    color: #0C0C0C !important;\n    border-color: #fefefe !important;\n  }\n  .gmail_dark .nf-fallback,\n  .gmail_dark_theme .nf-fallback,\n  [data-darkmode=\"true\"] .nf-fallback {\n    color: #a1a1aa !important;\n  }\n\n  /* Outlook web/mobile dark mode targeting */\n  [data-ogsb] .nf-body {\n    background-color: #0C0C0C !important;\n  }\n  [data-ogsb] .nf-card {\n    background-color: #161618 !important;\n    border-color: #1D1D1D !important;\n  }\n  [data-ogsb] .nf-callout {\n    background-color: #0F0F10 !important;\n    border-color: #1D1D1D !important;\n  }\n  [data-ogsc] .nf-eyebrow {\n    color: #a1a1aa !important;\n  }\n  [data-ogsc] .nf-callout-accent {\n    background-color: #fefefe !important;\n  }\n  [data-ogsc] .nf-cta {\n    background-color: #fefefe !important;\n    color: #0C0C0C !important;\n    border-color: #fefefe !important;\n  }\n  [data-ogsc] .nf-fallback {\n    color: #a1a1aa !important;\n  }\n";
var NotificationEmail = function (_a) {
    var _b = _a.preview, preview = _b === void 0 ? "Job J-1024 assigned to you" : _b, _c = _a.heading, heading = _c === void 0 ? "Job assigned to you" : _c, _d = _a.message, message = _d === void 0 ? "Job J-1024 assigned to you" : _d, _e = _a.recipientName, recipientName = _e === void 0 ? "Huckleberry" : _e, _f = _a.ctaLabel, ctaLabel = _f === void 0 ? "View details" : _f, _g = _a.ctaUrl, ctaUrl = _g === void 0 ? "https://app.carbon.ms/x/job/1234567890" : _g;
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    return (<Theme_1.EmailThemeProvider preview={<components_1.Preview>{preview}</components_1.Preview>} additionalHeadContent={<style>{notificationStyles}</style>}>
      <components_1.Body className={"my-auto mx-auto font-sans nf-body ".concat(themeClasses.body)}>
        <components_1.Container className={"my-[40px] mx-auto p-[36px] max-w-[560px] rounded-[16px] nf-card ".concat(themeClasses.container)} style={{
            borderRadius: 16,
            borderStyle: "solid",
            borderWidth: 1
        }}>
          <Logo_1.Logo />

          <components_1.Text className={"text-[11px] leading-[16px] uppercase text-center font-medium m-0 mt-[40px] mb-[10px] nf-eyebrow ".concat(themeClasses.mutedText)} style={{ letterSpacing: "0.14em" }}>
            New notification
          </components_1.Text>

          <components_1.Heading className={"text-[26px] font-medium text-center tracking-tight p-0 mt-0 mb-[32px] mx-0 ".concat(themeClasses.heading)}>
            {heading}
          </components_1.Heading>

          <components_1.Section>
            <components_1.Text className={"text-[15px] leading-[26px] m-0 mb-[16px] ".concat(themeClasses.text)}>
              Hi {recipientName !== null && recipientName !== void 0 ? recipientName : "there"},
            </components_1.Text>
          </components_1.Section>

          <components_1.Section className="nf-callout" style={{
            backgroundColor: "#fafafa",
            borderColor: "#ececef",
            borderRadius: 12,
            borderStyle: "solid",
            borderWidth: 1,
            marginBottom: 28,
            padding: "18px 20px"
        }}>
            <table role="presentation" cellPadding={0} cellSpacing={0} width="100%" style={{ borderCollapse: "collapse", width: "100%" }}>
              <tr>
                <td style={{ verticalAlign: "middle" }}>
                  <components_1.Text className={"text-[15px] leading-[24px] m-0 ".concat(themeClasses.text)}>
                    {message}
                  </components_1.Text>
                </td>
              </tr>
            </table>
          </components_1.Section>

          {ctaUrl && (<>
              <components_1.Section className="text-center mb-[24px]">
                <components_1.Button href={ctaUrl} className="nf-cta" style={{
                backgroundColor: "#0e0e0e",
                borderColor: "#0e0e0e",
                borderRadius: 10,
                borderStyle: "solid",
                borderWidth: 1,
                color: "#ffffff",
                display: "inline-block",
                fontSize: 14,
                fontWeight: 500,
                padding: "13px 24px",
                textAlign: "center",
                textDecoration: "none"
            }}>
                  <span style={{ verticalAlign: "middle" }}>{ctaLabel}</span>
                </components_1.Button>
              </components_1.Section>

              <components_1.Text className={"text-[13px] leading-[20px] m-0 text-center break-all nf-fallback ".concat(themeClasses.mutedText)}>
                Or open this link in your browser:{" "}
                <components_1.Link href={ctaUrl} className={"".concat(themeClasses.mutedText, " underline nf-fallback")}>
                  {ctaUrl}
                </components_1.Link>
              </components_1.Text>
            </>)}

          {/* <Hr className={`my-[32px] nf-divider ${themeClasses.border}`} />

        <Text
          className={`text-[12px] leading-[18px] m-0 nf-fallback ${themeClasses.mutedText}`}
        >
          You're receiving this email because you have email notifications
          enabled on your Carbon account. You can manage your preferences from
          your account settings.
        </Text> */}
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.NotificationEmail = NotificationEmail;
exports.default = exports.NotificationEmail;
