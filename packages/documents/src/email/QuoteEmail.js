"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("@carbon/env");
var utils_1 = require("@carbon/utils");
var components_1 = require("@react-email/components");
var Theme_1 = require("./components/Theme");
var QuoteEmail = function (_a) {
    var _b;
    var company = _a.company, companySettings = _a.companySettings, locale = _a.locale, quote = _a.quote, recipient = _a.recipient, sender = _a.sender;
    var digitalQuoteUrl = companySettings.digitalQuoteEnabled && !!quote.externalLinkId
        ? "".concat((0, env_1.getAppUrl)(), "/share/quote/").concat(quote.externalLinkId) // the VERCEL_URL variable was giving us a preview branch
        : undefined;
    var preview = <components_1.Preview>{"".concat(quote.quoteId, " from ").concat(company.name)}</components_1.Preview>;
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    return (<Theme_1.EmailThemeProvider preview={preview}>
      <components_1.Body className={"my-auto mx-auto font-sans ".concat(themeClasses.body)} style={lightStyles.body}>
        <components_1.Container className={"mx-auto py-5 px-0 w-[660px] max-w-full ".concat(themeClasses.container)} style={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: lightStyles.container.borderColor
        }}>
          <components_1.Section>
            <components_1.Row>
              <components_1.Column>
                {company.logoLightIcon ? (<components_1.Img src={company.logoLightIcon} width="auto" height="42" alt={"".concat(company.name, " Logo")}/>) : (<components_1.Text className={"text-3xl font-bold ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
                    {company.name}
                  </components_1.Text>)}
              </components_1.Column>
              <components_1.Column className="text-right">
                <components_1.Text className={"text-3xl font-light ".concat(themeClasses.mutedText)} style={{ color: lightStyles.mutedText.color }}>
                  Quote
                </components_1.Text>
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
          <components_1.Section>
            {digitalQuoteUrl ? (<>
                <components_1.Text className={"text-left text-sm font-medium ".concat(themeClasses.text, " my-9")} style={{ color: lightStyles.text.color }}>
                  {recipient.firstName ? "Hi ".concat(recipient.firstName, ", ") : "Hi, "}
                  we are pleased to provide you with your digital quote, which
                  is available for review here:
                </components_1.Text>
                <Theme_1.Button href={digitalQuoteUrl} className="mb-4">
                  View Digital Quote
                </Theme_1.Button>
              </>) : (<components_1.Text className={"text-left text-sm font-medium ".concat(themeClasses.text, " my-9")} style={{ color: lightStyles.text.color }}>
                {recipient.firstName ? "Hi ".concat(recipient.firstName, ", ") : "Hi, "}
                please see the attached quote and let me know if you have any
                questions.
              </components_1.Text>)}
          </components_1.Section>
          <components_1.Section className="bg-gray-50 rounded-lg text-xs">
            <components_1.Row>
              <components_1.Column className="p-5" colSpan={2}>
                <components_1.Section>
                  <components_1.Row>
                    <components_1.Column>
                      <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                        Reference Number
                      </components_1.Text>
                      <components_1.Text>{(_b = quote.customerReference) !== null && _b !== void 0 ? _b : "-"}</components_1.Text>
                    </components_1.Column>
                  </components_1.Row>

                  <components_1.Row>
                    <components_1.Column>
                      <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                        Quote ID
                      </components_1.Text>
                      <components_1.Text>{quote.quoteId}</components_1.Text>
                    </components_1.Column>
                    <components_1.Column>
                      <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                        Expiration Date
                      </components_1.Text>
                      <components_1.Text>
                        {quote.expirationDate
            ? (0, utils_1.formatDate)(quote.expirationDate, undefined, locale)
            : "-"}
                      </components_1.Text>
                    </components_1.Column>
                  </components_1.Row>
                </components_1.Section>
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>

          <components_1.Section>
            <components_1.Row>
              <components_1.Column className="text-center">
                {company.logoLightIcon ? (<components_1.Img src={company.logoLightIcon} width="60" height="auto" alt={"".concat(company.name, " Logo")}/>) : (<components_1.Text className={"text-3xl font-bold ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
                    {company.name}
                  </components_1.Text>)}
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.default = QuoteEmail;
