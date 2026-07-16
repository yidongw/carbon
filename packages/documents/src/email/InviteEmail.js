"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteEmail = void 0;
var components_1 = require("@react-email/components");
var Logo_1 = require("./components/Logo");
var Theme_1 = require("./components/Theme");
var InviteEmail = function (_a) {
    var _b = _a.invitedByEmail, invitedByEmail = _b === void 0 ? "tom@sawyer.com" : _b, _c = _a.invitedByName, invitedByName = _c === void 0 ? "Tom Sawyer" : _c, _d = _a.email, email = _d === void 0 ? "huck@sawyer.com" : _d, name = _a.name, _e = _a.companyName, companyName = _e === void 0 ? "Tombstone" : _e, _f = _a.inviteLink, inviteLink = _f === void 0 ? "https://carbon.ms/invite/1234567890" : _f, _g = _a.ip, ip = _g === void 0 ? "38.38.38.38" : _g, _h = _a.location, location = _h === void 0 ? "Tombstone, AZ" : _h;
    var preview = <components_1.Preview>{"Join ".concat(companyName, " on Carbon")}</components_1.Preview>;
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    return (<Theme_1.EmailThemeProvider preview={preview}>
      <components_1.Body className={"my-auto mx-auto font-sans ".concat(themeClasses.body)} style={lightStyles.body}>
        <components_1.Container className={"my-[40px] mx-auto p-[20px] max-w-[600px] ".concat(themeClasses.container)} style={{
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: lightStyles.container.borderColor
        }}>
          <Logo_1.Logo />
          <components_1.Heading className={"mx-0 my-[30px] p-0 text-[24px] font-normal ".concat(themeClasses.text, " text-center")} style={{ color: lightStyles.text.color }}>
            Join <strong>{companyName}</strong> on <strong>Carbon</strong>
          </components_1.Heading>

          <components_1.Text className={"text-[14px] leading-[24px] ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
            Hi {name !== null && name !== void 0 ? name : ""},
          </components_1.Text>

          <components_1.Text className={"text-[14px] leading-[24px] ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
            {invitedByName} (
            <components_1.Link href={"mailto:".concat(invitedByEmail)} className={"".concat(themeClasses.text, " no-underline")} style={{ color: lightStyles.text.color }}>
              {invitedByEmail}
            </components_1.Link>
            ) has invited you to join <strong>{companyName}</strong> on{" "}
            <strong>Carbon</strong>.
          </components_1.Text>
          <components_1.Section className="mb-[42px] mt-[32px] text-center">
            <Theme_1.Button href={inviteLink}>Accept Invite</Theme_1.Button>
          </components_1.Section>

          <components_1.Text className={"text-[14px] leading-[24px] ".concat(themeClasses.mutedText, " break-all")} style={{ color: lightStyles.mutedText.color }}>
            You can accept this invite by clicking the button above or by
            copying and pasting the following link into your browser:{" "}
            <components_1.Link href={inviteLink} className={"".concat(themeClasses.mutedText, " underline")} style={{ color: lightStyles.mutedText.color }}>
              {inviteLink}
            </components_1.Link>
          </components_1.Text>

          <br />
          <components_1.Section>
            <components_1.Text className={"text-[12px] leading-[24px] ".concat(themeClasses.mutedText)} style={{ color: lightStyles.mutedText.color }}>
              This invitation was intended for{" "}
              <span className={themeClasses.text} style={{ color: lightStyles.text.color }}>
                {email}
              </span>
              . This invite was sent from{" "}
              <span className={themeClasses.text} style={{ color: lightStyles.text.color }}>
                {ip}
              </span>{" "}
              located in{" "}
              <span className={themeClasses.text} style={{ color: lightStyles.text.color }}>
                {location}
              </span>
              . If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account's safety, please
              reply to this email to get in touch with us.
            </components_1.Text>
          </components_1.Section>
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.InviteEmail = InviteEmail;
exports.default = exports.InviteEmail;
