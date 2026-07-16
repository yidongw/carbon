"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var env_js_1 = require("./env.js");
var ports = {
    PORT_DB: 54000,
    PORT_API: 54001,
    PORT_STUDIO: 54002,
    PORT_INBUCKET: 54003,
    PORT_INNGEST: 54004,
    PORT_ERP: 54005,
    PORT_MES: 54006
};
var jwt = {
    secret: "test-secret",
    anonKey: "test-anon-key",
    serviceKey: "test-service-key"
};
(0, vitest_1.describe)("renderEnv (portless disabled)", function () {
    (0, vitest_1.it)("emits localhost URLs for app and supabase", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "feat-x",
            ports: ports,
            redisDb: 3,
            jwt: jwt,
            portless: false
        });
        (0, vitest_1.expect)(out).toContain("CARBON_WORKTREE=feat-x");
        (0, vitest_1.expect)(out).toContain("ERP_URL=http://localhost:54005");
        (0, vitest_1.expect)(out).toContain("MES_URL=http://localhost:54006");
        (0, vitest_1.expect)(out).toContain("SUPABASE_URL=http://localhost:54001");
        (0, vitest_1.expect)(out).not.toContain("PORTLESS_TLD");
    });
    (0, vitest_1.it)("wires every port into env vars", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: false
        });
        (0, vitest_1.expect)(out).toContain("PORT_DB=54000");
        (0, vitest_1.expect)(out).toContain("PORT_API=54001");
        (0, vitest_1.expect)(out).toContain("PORT_STUDIO=54002");
        (0, vitest_1.expect)(out).toContain("PORT_INBUCKET=54003");
        (0, vitest_1.expect)(out).toContain("PORT_INNGEST=54004");
        (0, vitest_1.expect)(out).toContain("PORT_ERP=54005");
        (0, vitest_1.expect)(out).toContain("PORT_MES=54006");
    });
    (0, vitest_1.it)("places redis db index in REDIS_URL", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 7,
            jwt: jwt,
            portless: false
        });
        (0, vitest_1.expect)(out).toMatch(/REDIS_URL=redis:\/\/localhost:\d+\/7/);
    });
    (0, vitest_1.it)("injects jwt creds verbatim", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: false
        });
        (0, vitest_1.expect)(out).toContain("SUPABASE_JWT_SECRET=test-secret");
        (0, vitest_1.expect)(out).toContain("SUPABASE_ANON_KEY=test-anon-key");
        (0, vitest_1.expect)(out).toContain("SUPABASE_SERVICE_ROLE_KEY=test-service-key");
    });
    (0, vitest_1.it)("ends with a trailing newline", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: false
        });
        (0, vitest_1.expect)(out.endsWith("\n")).toBe(true);
    });
});
(0, vitest_1.describe)("renderEnv (portless enabled)", function () {
    (0, vitest_1.it)("emits portless hostnames for app and supabase", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "feat-x",
            ports: ports,
            redisDb: 3,
            jwt: jwt,
            portless: true,
            branchPrefix: "feat-x"
        });
        (0, vitest_1.expect)(out).toContain("CARBON_WORKTREE=feat-x");
        (0, vitest_1.expect)(out).toContain("ERP_URL=https://erp.feat-x.dev");
        (0, vitest_1.expect)(out).toContain("MES_URL=https://mes.feat-x.dev");
        (0, vitest_1.expect)(out).toContain("SUPABASE_URL=https://api.feat-x.dev");
        (0, vitest_1.expect)(out).toContain("PORTLESS_TLD=dev");
    });
    (0, vitest_1.it)("wires every port into env vars", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: true,
            branchPrefix: "s"
        });
        (0, vitest_1.expect)(out).toContain("PORT_DB=54000");
        (0, vitest_1.expect)(out).toContain("PORT_API=54001");
        (0, vitest_1.expect)(out).toContain("PORT_STUDIO=54002");
        (0, vitest_1.expect)(out).toContain("PORT_INBUCKET=54003");
        (0, vitest_1.expect)(out).toContain("PORT_INNGEST=54004");
        (0, vitest_1.expect)(out).toContain("PORT_ERP=54005");
        (0, vitest_1.expect)(out).toContain("PORT_MES=54006");
    });
    (0, vitest_1.it)("places redis db index in REDIS_URL", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 7,
            jwt: jwt,
            portless: true,
            branchPrefix: "s"
        });
        (0, vitest_1.expect)(out).toMatch(/REDIS_URL=redis:\/\/localhost:\d+\/7/);
    });
    (0, vitest_1.it)("injects jwt creds verbatim", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: true,
            branchPrefix: "s"
        });
        (0, vitest_1.expect)(out).toContain("SUPABASE_JWT_SECRET=test-secret");
        (0, vitest_1.expect)(out).toContain("SUPABASE_ANON_KEY=test-anon-key");
        (0, vitest_1.expect)(out).toContain("SUPABASE_SERVICE_ROLE_KEY=test-service-key");
    });
    (0, vitest_1.it)("ends with a trailing newline", function () {
        var out = (0, env_js_1.renderEnv)({
            slug: "s",
            ports: ports,
            redisDb: 0,
            jwt: jwt,
            portless: true,
            branchPrefix: "s"
        });
        (0, vitest_1.expect)(out.endsWith("\n")).toBe(true);
    });
});
