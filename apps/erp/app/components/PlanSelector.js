"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanSelector = PlanSelector;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_router_1 = require("react-router");
// Per-seat prices per user per month. Recurring (monthly) and one-time annual
// differ; annual is the discounted, prepaid rate. Annual total = monthly x 12.
// USD is shown everywhere except China (see currency selection below).
function usePlans() {
    var t = (0, macro_1.useLingui)().t;
    return {
        STARTER: {
            monthly: { usd: 40, cny: 288 },
            annualMonthly: { usd: 30, cny: 200 },
            userMinimum: 0,
            description: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Perfect for low-cost evaluation"], ["Perfect for low-cost evaluation"]))),
            features: [
                t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ERP, MES, QMS"], ["ERP, MES, QMS"]))),
                t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Cloud-Hosted"], ["Cloud-Hosted"]))),
                t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Self-Onboarding with Carbon Academy"], ["Self-Onboarding with Carbon Academy"])))
            ]
        },
        BUSINESS: {
            monthly: { usd: 100, cny: 720 },
            annualMonthly: { usd: 75, cny: 500 },
            userMinimum: 5,
            description: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["For growing businesses that need support"], ["For growing businesses that need support"]))),
            features: [
                t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["5 User Minimum"], ["5 User Minimum"]))),
                t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Everything from Starter"], ["Everything from Starter"]))),
                t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["API and Webhooks"], ["API and Webhooks"]))),
                t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Implementation Support"], ["Implementation Support"]))),
                t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Unlimited Functional Support"], ["Unlimited Functional Support"])))
            ]
        }
    };
}
// Region-aware plan picker with one-time (annual) / recurring (monthly) tabs.
// Rendered both in onboarding and in Billing settings; the enclosing route's
// action handles the POST (planId / mode / quantity, plus intent when provided).
function PlanSelector(_a) {
    var plans = _a.plans, ipCountry = _a.ipCountry, intent = _a.intent;
    var t = (0, macro_1.useLingui)().t;
    var PLANS = usePlans();
    var locale = (0, i18n_1.useLocale)().locale;
    // Either signal — Chinese language OR a China IP — shows CNY; otherwise USD.
    var currency = locale.toLowerCase().startsWith("zh") || ipCountry === "CN" ? "cny" : "usd";
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency.toUpperCase(),
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }, [locale, currency]);
    // One-time annual is the default (WeChat Pay / Alipay only work one-time).
    var _b = (0, react_2.useState)("one_time"), billingMode = _b[0], setBillingMode = _b[1];
    var sortedPlans = (0, react_2.useMemo)(function () {
        return __spreadArray([], plans, true).sort(function (a, b) {
            var _a, _b;
            var priceA = ((_a = PLANS[a.id]) === null || _a === void 0 ? void 0 : _a.monthly.usd) || 0;
            var priceB = ((_b = PLANS[b.id]) === null || _b === void 0 ? void 0 : _b.monthly.usd) || 0;
            return priceA - priceB;
        });
    }, [plans, PLANS]);
    return (<div className="w-full">
      <react_1.CardDescription className="mb-3">
        {billingMode === "one_time"
            ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Pay for one year up front with WeChat Pay, Alipay, or card. Renew before it expires."], ["Pay for one year up front with WeChat Pay, Alipay, or card. Renew before it expires."]))) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Pay monthly by card, charged immediately. Switch or cancel anytime."], ["Pay monthly by card, charged immediately. Switch or cancel anytime."])))}
      </react_1.CardDescription>
      <react_1.Tabs value={billingMode} onValueChange={function (value) { return setBillingMode(value); }}>
        <react_1.TabsList className="grid grid-cols-2 w-full mb-6">
          <react_1.TabsTrigger value="one_time">
            <macro_1.Trans>One-time (annual)</macro_1.Trans>
          </react_1.TabsTrigger>
          <react_1.TabsTrigger value="subscription">
            <macro_1.Trans>Recurring (monthly)</macro_1.Trans>
          </react_1.TabsTrigger>
        </react_1.TabsList>
      </react_1.Tabs>

      <div className={(0, react_1.cn)("grid gap-6", plans.length === 1
            ? "grid-cols-1 justify-center"
            : "grid-cols-1 md:grid-cols-2")}>
        {sortedPlans.map(function (plan) { return (<PlanCard key={plan.id} plan={plan} planDetails={PLANS[plan.id]} formatter={formatter} currency={currency} billingMode={billingMode} intent={intent}/>); })}
      </div>
    </div>);
}
function PlanCard(_a) {
    var _b, _c, _d, _e;
    var plan = _a.plan, planDetails = _a.planDetails, formatter = _a.formatter, currency = _a.currency, billingMode = _a.billingMode, intent = _a.intent;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var isSubmitting = fetcher.state !== "idle";
    var isOneTime = billingMode === "one_time";
    var minSeats = Math.max(1, (_b = planDetails === null || planDetails === void 0 ? void 0 : planDetails.userMinimum) !== null && _b !== void 0 ? _b : 1);
    var _f = (0, react_2.useState)(minSeats), seats = _f[0], setSeats = _f[1];
    var oneTimeAvailable = Boolean(plan.stripeAnnualPriceId);
    return (<react_1.Card className="relative">
      <react_1.CardHeader>
        <react_1.CardTitle>{plan.name}</react_1.CardTitle>
        <react_1.CardDescription>{planDetails === null || planDetails === void 0 ? void 0 : planDetails.description}</react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        {isOneTime ? (<react_1.VStack spacing={4} className="w-full">
            <div className="w-full">
              <div className="flex items-baseline">
                <span className="text-5xl font-bold tracking-tighter">
                  {formatter.format((_c = planDetails === null || planDetails === void 0 ? void 0 : planDetails.annualMonthly[currency]) !== null && _c !== void 0 ? _c : 0)}
                </span>
                <span className="ml-1 text-sm text-muted-foreground tracking-tighter">
                  <macro_1.Trans>/user/mo</macro_1.Trans>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Billed annually \u00B7 ", "/user/yr"], ["Billed annually \u00B7 ", "/user/yr"])), formatter.format(((_d = planDetails === null || planDetails === void 0 ? void 0 : planDetails.annualMonthly[currency]) !== null && _d !== void 0 ? _d : 0) * 12))}
              </p>
            </div>
            <div className="w-full">
              <react_1.Label htmlFor={"seats-".concat(plan.id)}>
                <macro_1.Trans>Seats</macro_1.Trans>
              </react_1.Label>
              <react_1.NumberField value={seats} minValue={minSeats} onChange={function (value) {
                if (Number.isFinite(value))
                    setSeats(value);
            }}>
                <react_1.NumberInput id={"seats-".concat(plan.id)} className="w-full"/>
              </react_1.NumberField>
              {minSeats > 1 && (<p className="text-xs text-muted-foreground mt-1">
                  {t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["", " user minimum"], ["", " user minimum"])), minSeats)}
                </p>)}
            </div>
            <p className="text-sm text-muted-foreground">
              <macro_1.Trans>Total shown at checkout.</macro_1.Trans>
            </p>
          </react_1.VStack>) : (<div className="flex items-baseline">
            <span className="text-5xl font-bold tracking-tighter">
              {formatter.format((_e = planDetails === null || planDetails === void 0 ? void 0 : planDetails.monthly[currency]) !== null && _e !== void 0 ? _e : 0)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground tracking-tighter">
              <macro_1.Trans>/month/user</macro_1.Trans>
            </span>
          </div>)}
        <ul className="mt-6 space-y-3">
          {planDetails === null || planDetails === void 0 ? void 0 : planDetails.features.map(function (feature, index) { return (<li key={index} className="flex items-center justify-start gap-2">
              <span className="text-sm">{feature}</span>
            </li>); })}
        </ul>
      </react_1.CardContent>
      <react_1.CardFooter>
        <react_1.VStack className="w-full">
          <fetcher.Form method="post" className="w-full">
            {intent && <input type="hidden" name="intent" value={intent}/>}
            <input type="hidden" name="planId" value={plan.id}/>
            <input type="hidden" name="mode" value={isOneTime ? "one_time" : "subscription"}/>
            {isOneTime && <input type="hidden" name="quantity" value={seats}/>}
            <react_1.Button className="w-full" variant="primary" type="submit" isDisabled={isSubmitting || (isOneTime && !oneTimeAvailable)} isLoading={isSubmitting}>
              {isOneTime
            ? oneTimeAvailable
                ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Pay 1 Year"], ["Pay 1 Year"]))) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Not available"], ["Not available"])))
            : t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Start Now"], ["Start Now"])))}
            </react_1.Button>
          </fetcher.Form>
        </react_1.VStack>
      </react_1.CardFooter>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
