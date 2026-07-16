"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegrationServerHooks = getIntegrationServerHooks;
var hooks_server_1 = require("./email/hooks.server");
var hooks_server_2 = require("./jira/hooks.server");
var hooks_server_3 = require("./linear/hooks.server");
var hooks_server_4 = require("./xero/hooks.server");
/**
 * Server-side hooks registry for integrations.
 *
 * Hooks that depend on server-only modules (like getCarbonServiceRole)
 * cannot live in the integration config files because those are bundled
 * for both client and server. This registry maps integration IDs to
 * their server-only lifecycle hooks.
 */
var serverHooks = {
    email: {
        onHealthcheck: hooks_server_1.emailHealthcheck
    },
    jira: {
        onHealthcheck: hooks_server_2.jiraHealthcheck
    },
    linear: {
        onHealthcheck: hooks_server_3.linearHealthcheck
    },
    xero: {
        onHealthcheck: hooks_server_4.xeroHealthcheck,
        onInstall: hooks_server_4.xeroOnInstall,
        onUninstall: hooks_server_4.xeroOnUninstall
    }
};
function getIntegrationServerHooks(integrationId) {
    return serverHooks[integrationId];
}
