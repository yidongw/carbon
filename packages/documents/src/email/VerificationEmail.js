"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationEmail = void 0;
var components_1 = require("@react-email/components");
var Logo_1 = require("./components/Logo");
var Theme_1 = require("./components/Theme");
var VerificationEmail = function (_a) {
    var _b = _a.email, email = _b === void 0 ? "user@example.com" : _b, _c = _a.verificationCode, verificationCode = _c === void 0 ? "123456" : _c;
    var text = "Your verification code is ".concat(verificationCode);
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    return (<Theme_1.EmailThemeProvider preview={<components_1.Preview>{text}</components_1.Preview>}>
      <components_1.Body className={"my-auto mx-auto font-sans ".concat(themeClasses.body)} style={lightStyles.body}>
        <components_1.Container className={"my-[40px] mx-auto p-[20px] max-w-[600px] text-center ".concat(themeClasses.container)} style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: lightStyles.container.borderColor
        }}>
          <Logo_1.Logo />
          <components_1.Heading className={"text-[21px] font-normal text-center p-0 my-[30px] mx-0 ".concat(themeClasses.heading)} style={{ color: lightStyles.text.color }}>
            Verify your email address
          </components_1.Heading>

          <components_1.Text className={"text-center ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
            We've sent this verification code to{" "}
            <span className="font-medium">{email}</span>
          </components_1.Text>

          <components_1.Section className="text-center my-[40px]">
            <div style={{
            display: "inline-block",
            padding: "20px 40px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
        }}>
              <components_1.Text className="text-center font-mono" style={{
            fontSize: "32px",
            fontWeight: "bold",
            letterSpacing: "8px",
            color: "#333",
            margin: 0
        }}>
                {verificationCode}
              </components_1.Text>
            </div>
          </components_1.Section>

          <components_1.Text className={"text-center ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
            This code will expire in 10 minutes. If you didn't request this
            verification code, please ignore this email.
          </components_1.Text>

          <components_1.Text className={"text-center text-sm mt-[40px] ".concat(themeClasses.text)} style={{
            color: lightStyles.text.color,
            fontSize: "14px",
            opacity: 0.7
        }}>
            If you're having trouble, you can reply to this email or contact us
            at support@carbon.ms
          </components_1.Text>
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.VerificationEmail = VerificationEmail;
exports.default = exports.VerificationEmail;
