"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wechatStateStorage = void 0;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
exports.wechatStateStorage = (0, react_router_1.createCookieSessionStorage)({
    cookie: {
        name: "wechat_state",
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [auth_1.SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10 // 10 minutes
    }
});
