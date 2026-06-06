import { SESSION_SECRET } from "@carbon/auth";
import { createCookieSessionStorage } from "react-router";

export const wechatStateStorage = createCookieSessionStorage({
  cookie: {
    name: "wechat_state",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10 // 10 minutes
  }
});
