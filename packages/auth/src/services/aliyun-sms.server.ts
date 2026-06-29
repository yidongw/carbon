import {
  ALIBABA_CLOUD_ACCESS_KEY_ID,
  ALIBABA_CLOUD_ACCESS_KEY_SECRET,
  ALIBABA_CLOUD_SMS_SIGN_NAME,
  ALIBABA_CLOUD_SMS_TEMPLATE_CODE
} from "@carbon/env";
import { createHmac, randomUUID } from "node:crypto";

// Aliyun 号码认证服务 (Dypnsapi) — SMS verification-code service. Aliyun GENERATES,
// stores, rate-limits AND validates the code; we only call send + check (we never
// generate or persist a code ourselves). Domestic China only (CountryCode 86).
// RPC-style API signed with Aliyun's v1 HMAC-SHA1 scheme — implemented with fetch
// to match the rest of this package (cf. wechat.server.ts) rather than pulling in
// the Aliyun SDK.
const DYPNSAPI_ENDPOINT = "https://dypnsapi.aliyuncs.com/";
const DYPNSAPI_VERSION = "2017-05-25";

/** RFC 3986 percent-encoding, as required by Aliyun's signing algorithm. */
function percentEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/\+/g, "%20")
    .replace(/\*/g, "%2A")
    .replace(/%7E/g, "~");
}

function canonicalize(params: Record<string, string>): string {
  return Object.entries(params)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${percentEncode(key)}=${percentEncode(value)}`)
    .join("&");
}

/** Sign with HMAC-SHA1 over "GET&%2F&<canonicalized-query>" using "<secret>&". */
function sign(params: Record<string, string>): string {
  const stringToSign = `GET&${percentEncode("/")}&${percentEncode(
    canonicalize(params)
  )}`;
  return createHmac("sha1", `${ALIBABA_CLOUD_ACCESS_KEY_SECRET}&`)
    .update(stringToSign)
    .digest("base64");
}

async function callDypnsapi(
  action: string,
  business: Record<string, string>
): Promise<Record<string, any> | null> {
  if (!ALIBABA_CLOUD_ACCESS_KEY_ID || !ALIBABA_CLOUD_ACCESS_KEY_SECRET) {
    console.error("[aliyun sms] missing ALIBABA_CLOUD_ACCESS_KEY_* env");
    return null;
  }

  const params: Record<string, string> = {
    ...business,
    Action: action,
    Format: "JSON",
    Version: DYPNSAPI_VERSION,
    AccessKeyId: ALIBABA_CLOUD_ACCESS_KEY_ID,
    SignatureMethod: "HMAC-SHA1",
    SignatureVersion: "1.0",
    SignatureNonce: randomUUID(),
    // ISO8601 UTC without milliseconds, e.g. 2026-06-29T12:00:00Z.
    Timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z")
  };
  params.Signature = sign(params);

  try {
    const resp = await fetch(`${DYPNSAPI_ENDPOINT}?${canonicalize(params)}`);
    const data = (await resp.json()) as Record<string, any>;
    if (data.Code !== "OK") {
      console.error("[aliyun sms] api error", JSON.stringify(data));
      return null;
    }
    return data;
  } catch (err) {
    console.error("[aliyun sms] request failed", err);
    return null;
  }
}

// Code validity. The system templates (e.g. 100001 "您的验证码为${code}。…${min}分钟内
// 有效") expect both a `code` and a `min` variable, so they must stay in sync.
const CODE_VALID_MINUTES = 5;

/**
 * Send an SMS verification code to a phone number. The `##code##` placeholder tells
 * Aliyun to generate (and later be able to validate) the code; passing a literal
 * code instead would make CheckSmsVerifyCode unusable. The template variables
 * (`code`, `min`) must match the configured system template.
 */
export async function sendSmsVerifyCode(phoneNumber: string): Promise<boolean> {
  if (!ALIBABA_CLOUD_SMS_SIGN_NAME || !ALIBABA_CLOUD_SMS_TEMPLATE_CODE) {
    console.error("[aliyun sms] missing sign name or template code env");
    return false;
  }

  const data = await callDypnsapi("SendSmsVerifyCode", {
    PhoneNumber: phoneNumber,
    SignName: ALIBABA_CLOUD_SMS_SIGN_NAME,
    TemplateCode: ALIBABA_CLOUD_SMS_TEMPLATE_CODE,
    TemplateParam: JSON.stringify({
      code: "##code##",
      min: String(CODE_VALID_MINUTES)
    }),
    CodeLength: "6",
    ValidTime: String(CODE_VALID_MINUTES * 60)
  });

  return !!data;
}

/**
 * Verify a code the user entered. Aliyun owns the code lifecycle, so a successful
 * API call does NOT mean the code matched — the outcome lives in Model.VerifyResult
 * and only "PASS" counts as verified.
 */
export async function checkSmsVerifyCode(
  phoneNumber: string,
  verifyCode: string
): Promise<boolean> {
  const data = await callDypnsapi("CheckSmsVerifyCode", {
    PhoneNumber: phoneNumber,
    VerifyCode: verifyCode
  });

  return data?.Model?.VerifyResult === "PASS";
}
