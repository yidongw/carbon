"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jira = void 0;
exports.Logo = Logo;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var fns_1 = require("../fns");
exports.Jira = (0, fns_1.defineIntegration)({
    name: "Jira",
    id: "jira",
    active: !!auth_1.JIRA_CLIENT_ID,
    category: "Project Management",
    logo: Logo,
    description: "Jira is a project management and issue tracking tool by Atlassian. With this integration, you can link quality issues from Carbon to Jira for tracking and collaboration.",
    shortDescription: "Sync quality issues from Carbon to Jira.",
    setupInstructions: SetupInstructions,
    images: [],
    settings: [],
    oauth: {
        authUrl: "https://auth.atlassian.com/authorize",
        clientId: auth_1.JIRA_CLIENT_ID,
        redirectUri: "/api/integrations/jira/oauth",
        scopes: [
            "read:jira-user",
            "read:jira-work",
            "write:jira-work",
            "offline_access"
        ],
        tokenUrl: "https://auth.atlassian.com/oauth/token"
    },
    schema: zod_1.z.object({})
});
function SetupInstructions(_a) {
    var companyId = _a.companyId;
    var webhookUrl = utils_1.isBrowser
        ? "".concat(window.location.origin, "/api/webhook/jira/").concat(companyId)
        : "";
    return (<>
      <p className="text-sm text-muted-foreground">
        To integrate Jira with Carbon, click the "Connect" button above to
        authorize Carbon with your Atlassian account.
      </p>
      <p className="text-sm text-muted-foreground">
        After connecting, you can optionally set up a webhook in Jira to receive
        real-time updates when issues change. Go to your Jira settings, then
        System → WebHooks, and create a new webhook with the URL below.
      </p>
      <react_1.InputGroup className="mb-8">
        <react_1.Input value={webhookUrl} readOnly/>
        <react_1.InputRightElement>
          <react_1.Copy text={webhookUrl}/>
        </react_1.InputRightElement>
      </react_1.InputGroup>
      <p className="text-sm text-muted-foreground">
        Select the following events: Issue updated, Issue deleted.
      </p>
    </>);
}
function Logo(props) {
    return (<svg xmlns="http://www.w3.org/2000/svg" {...props} width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <title>atlassian_jira</title>
      <rect width="24" height="24" fill="none"/>
      <path d="M11.53,2a4.37,4.37,0,0,0,4.35,4.35h1.78v1.7A4.35,4.35,0,0,0,22,12.4V2.84A.85.85,0,0,0,21.16,2H11.53M6.77,6.8a4.36,4.36,0,0,0,4.34,4.34h1.8v1.72a4.36,4.36,0,0,0,4.34,4.34V7.63a.84.84,0,0,0-.83-.83H6.77M2,11.6a4.34,4.34,0,0,0,4.35,4.34H8.13v1.72A4.36,4.36,0,0,0,12.47,22V12.43a.85.85,0,0,0-.84-.84H2Z"/>
    </svg>);
}
