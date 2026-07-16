"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.links = exports.clientMiddleware = exports.middleware = void 0;
exports.loader = loader;
exports.action = action;
exports.default = App;
exports.ErrorBoundary = ErrorBoundary;
var auth_1 = require("@carbon/auth");
var flash_client_1 = require("@carbon/auth/middleware/flash.client");
var flash_server_1 = require("@carbon/auth/middleware/flash.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("@vercel/analytics/react");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var config_1 = require("~/config");
var mode_server_1 = require("~/services/mode.server");
var nprogress_css_url_1 = require("~/styles/nprogress.css?url");
var tailwind_css_url_1 = require("~/styles/tailwind.css?url");
var AvatarMenu_1 = require("./components/AvatarMenu");
var useUser_1 = require("./hooks/useUser");
var path_1 = require("./utils/path");
exports.middleware = [flash_server_1.flashMiddleware];
exports.clientMiddleware = [flash_client_1.flashClientMiddleware];
var links = function () { return [
    { rel: "stylesheet", href: tailwind_css_url_1.default },
    { rel: "stylesheet", href: nprogress_css_url_1.default },
    {
        rel: "icon",
        type: "image/svg+xml",
        href: "/carbon-mark-light.svg",
        media: "(prefers-color-scheme: light)"
    },
    {
        rel: "icon",
        type: "image/svg+xml",
        href: "/carbon-mark-dark.svg",
        media: "(prefers-color-scheme: dark)"
    },
    {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
    },
    {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
    },
    {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
    },
    { rel: "manifest", href: "/site.webmanifest" }
]; };
exports.links = links;
var meta = function () {
    return [
        {
            title: "Carbon Academy"
        }
    ];
};
exports.meta = meta;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, CARBON_EDITION, CARBON_API_URL, POSTHOG_API_HOST, POSTHOG_PROJECT_PUBLIC_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, session, user, lessonCompletions, challengeAttempts, client, _d, authUser, completions, attempts;
        var _e, _f, _g;
        var request = _b.request, context = _b.context;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _c = (0, auth_1.getBrowserEnv)(), CARBON_EDITION = _c.CARBON_EDITION, CARBON_API_URL = _c.CARBON_API_URL, POSTHOG_API_HOST = _c.POSTHOG_API_HOST, POSTHOG_PROJECT_PUBLIC_KEY = _c.POSTHOG_PROJECT_PUBLIC_KEY, SUPABASE_URL = _c.SUPABASE_URL, SUPABASE_ANON_KEY = _c.SUPABASE_ANON_KEY;
                    return [4 /*yield*/, (0, session_server_1.getOrRefreshAuthSession)(request)];
                case 1:
                    session = _h.sent();
                    user = null;
                    lessonCompletions = [];
                    challengeAttempts = [];
                    if (!session) return [3 /*break*/, 3];
                    client = (0, auth_1.getCarbon)(session.accessToken);
                    return [4 /*yield*/, Promise.all([
                            client.from("user").select("*").eq("id", session.userId).single(),
                            client
                                .from("lessonCompletion")
                                .select("lessonId, courseId")
                                .eq("userId", session.userId),
                            client
                                .from("challengeAttempt")
                                .select("topicId, courseId, passed")
                                .eq("userId", session.userId)
                        ])];
                case 2:
                    _d = _h.sent(), authUser = _d[0], completions = _d[1], attempts = _d[2];
                    if (authUser.data) {
                        user = authUser.data;
                    }
                    lessonCompletions = (_e = completions.data) !== null && _e !== void 0 ? _e : [];
                    challengeAttempts = (_f = attempts.data) !== null && _f !== void 0 ? _f : [];
                    _h.label = 3;
                case 3: return [2 /*return*/, (0, react_router_1.data)({
                        challengeAttempts: challengeAttempts,
                        env: {
                            CARBON_EDITION: CARBON_EDITION,
                            CARBON_API_URL: CARBON_API_URL,
                            POSTHOG_API_HOST: POSTHOG_API_HOST,
                            POSTHOG_PROJECT_PUBLIC_KEY: POSTHOG_PROJECT_PUBLIC_KEY,
                            SUPABASE_URL: SUPABASE_URL,
                            SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
                        },
                        lessonCompletions: lessonCompletions,
                        mode: (0, mode_server_1.getMode)(request),
                        preferences: (0, utils_1.getPreferenceHeaders)(request),
                        result: context.get(flash_server_1.flashResultContext),
                        user: user,
                        session: session
                    }, {
                        headers: (_g = context.get(flash_server_1.flashHeadersContext)) !== null && _g !== void 0 ? _g : undefined
                    })];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var contentType, validation, _c, _d;
        var _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    contentType = (_e = request.headers.get("content-type")) !== null && _e !== void 0 ? _e : "";
                    if (!contentType.includes("multipart/form-data") &&
                        !contentType.includes("application/x-www-form-urlencoded")) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid content type" }, { status: 400 })];
                    }
                    _d = (_c = (0, form_1.validator)(utils_1.modeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                case 2:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(validation.error, "Invalid mode"), {
                                status: 400
                            })];
                    }
                    return [2 /*return*/, (0, react_router_1.data)({}, {
                            headers: { "Set-Cookie": (0, mode_server_1.setMode)(validation.data.mode) }
                        })];
            }
        });
    });
}
function Document(_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? "Carbon" : _b, _c = _a.mode, mode = _c === void 0 ? "light" : _c;
    return (<html lang="en" className={"".concat(mode, " h-full overflow-x-hidden")}>
      <head>
        <exports.meta charSet="utf-8"/>
        <exports.meta name="viewport" content="width=device-width, initial-scale=1"/>
        <react_router_1.Meta />
        <title>{title}</title>
        <react_router_1.Links />
      </head>
      <body className="h-full bg-background antialiased selection:bg-primary/10 selection:text-primary">
        <react_1.TooltipProvider>{children}</react_1.TooltipProvider>
        <react_1.Toaster position="bottom-right" visibleToasts={5}/>
        <react_router_1.ScrollRestoration />
        <react_router_1.Scripts />
        {!auth_1.CONTROLLED_ENVIRONMENT && <react_2.Analytics />}
      </body>
    </html>);
}
function App() {
    var _a, _b;
    var loaderData = (0, react_router_1.useLoaderData)();
    var env = (_a = loaderData === null || loaderData === void 0 ? void 0 : loaderData.env) !== null && _a !== void 0 ? _a : {};
    var prefs = loaderData === null || loaderData === void 0 ? void 0 : loaderData.preferences;
    var theme = "zinc";
    var challengeAttempts = (_b = loaderData === null || loaderData === void 0 ? void 0 : loaderData.challengeAttempts) !== null && _b !== void 0 ? _b : [];
    var disclosure = (0, react_1.useDisclosure)();
    /* Dark/Light Mode */
    var mode = (0, react_1.useMode)();
    var fetcher = (0, react_router_1.useFetcher)();
    var user = (0, useUser_1.useOptionalUser)();
    // Calculate total challenges from modules config
    var totalChallenges = config_1.modules.reduce(function (total, module) {
        return (total +
            module.courses.reduce(function (courseTotal, course) {
                return (courseTotal +
                    course.topics.reduce(function (topicTotal, topic) {
                        var hasChallenge = topic.challenge && topic.challenge.length > 0;
                        return topicTotal + (hasChallenge ? 1 : 0);
                    }, 0));
            }, 0));
    }, 0);
    var passedChallenges = challengeAttempts
        .filter(function (attempt) { return attempt.passed; })
        .filter(function (attempt, index, self) {
        return index === self.findIndex(function (a) { return a.topicId === attempt.topicId; });
    }).length;
    var completionPercentage = Math.round((passedChallenges / totalChallenges) * 100);
    return (<react_1.OperatingSystemContextProvider platform={prefs.platform}>
      <i18n_1.I18nProvider locale={prefs.locale}>
        <Document mode={mode} theme={theme}>
          <header className="flex select-none items-center py-4 pl-5 pr-2 h-[var(--header-height)]">
            <div className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-2 z-logo text-foreground w-full">
              <a href="https://carbon.ms" target="_blank" rel="noopener noreferrer" className="cursor-pointer inline-flex flex-row items-end gap-2 flex-shrink-0 font-display">
                <img src="/carbon-word-light.svg" alt="Carbon" className="h-7 w-auto block dark:hidden"/>
                <img src="/carbon-word-dark.svg" alt="Carbon" className="h-7 w-auto hidden dark:block"/>
              </a>
              <div className="flex items-center">
                <div className="items-center gap-1 hidden md:flex">
                  <react_1.Button variant="ghost" asChild>
                    <react_router_1.NavLink to={path_1.path.to.about}>About</react_router_1.NavLink>
                  </react_1.Button>
                  {user ? (<AvatarMenu_1.default className="ml-2"/>) : (<>
                      <react_1.Button variant="ghost" className="cursor-pointer" rightIcon={<lu_1.LuFingerprint className="size-4"/>} asChild>
                        <react_router_1.NavLink to={path_1.path.to.login}>Login</react_router_1.NavLink>
                      </react_1.Button>
                      <fetcher.Form action={path_1.path.to.root} method="post">
                        <input type="hidden" name="mode" value={mode === "light" ? "dark" : "light"}/>
                        <react_1.IconButton aria-label="Toggle Light Mode and Dark Mode" type="submit" variant="ghost" icon={mode === "light" ? <lu_1.LuMoon /> : <lu_1.LuSun />} className="cursor-pointer"/>
                      </fetcher.Form>
                    </>)}
                </div>
              </div>
            </div>
          </header>
          {user && (<div className="w-full bg-primary dark:bg-[#2f31ae]">
              <div className="max-w-5xl mx-auto px-3 py-4 flex gap-8 z-logo items-center text-white w-full">
                <span className="text-xl font-display">
                  {/* <span className="hidden lg:inline">Credential</span>  */}
                  Progress
                </span>
                <div className="flex items-center justify-between gap-2 flex-1">
                  <react_1.Progress value={completionPercentage}/>
                  <span className="text-xl font-display">
                    {completionPercentage}%
                  </span>
                </div>
                <react_1.Button variant="ghost" className="text-white hover:text-white/90" rightIcon={<lu_1.LuChevronDown className={"transition-transform duration-300 ".concat(disclosure.isOpen ? "rotate-180" : "")}/>} onClick={disclosure.onToggle}>
                  {disclosure.isOpen ? "Less" : "More"}
                </react_1.Button>
              </div>
              <framer_motion_1.motion.div className={(0, react_1.cn)("w-full bg-black/20", disclosure.isOpen ? "overflow-visible" : "overflow-hidden")} initial={{ height: 0, opacity: 0 }} animate={{
                height: disclosure.isOpen ? "auto" : 0,
                opacity: disclosure.isOpen ? 1 : 0
            }} transition={{
                height: {
                    duration: 0.3,
                    ease: "easeInOut"
                },
                opacity: {
                    duration: 0.2,
                    delay: disclosure.isOpen ? 0.1 : 0,
                    ease: "easeInOut"
                }
            }}>
                <div className="max-w-5xl mx-auto px-3 py-4 flex gap-8 z-logo items-center text-white w-full">
                  <div className="w-full bg-white/10 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {config_1.modules.map(function (module) {
                return module.courses.map(function (course) {
                    var totalChallenges = course.topics.reduce(function (acc, topic) {
                        return acc +
                            (topic.challenge && topic.challenge.length > 0
                                ? 1
                                : 0);
                    }, 0);
                    var completedChallenges = challengeAttempts.filter(function (attempt) {
                        return attempt.courseId === course.id && attempt.passed;
                    }).length;
                    var percentage = Math.min(Math.round((completedChallenges / totalChallenges) * 100), 100);
                    if (totalChallenges === 0) {
                        return null;
                    }
                    return (<react_router_1.Link to={path_1.path.to.course(module.id, course.id)} key={course.id} className={(0, react_1.cn)("cursor-pointer flex items-center gap-2", percentage === 0 && "opacity-50")}>
                            <div className="size-8 rounded-lg flex items-center justify-center" style={{
                            backgroundColor: module.background,
                            color: module.foreground
                        }}>
                              {course.icon}
                            </div>
                            <div className="flex-1 text-xs flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">
                                  {course.name}
                                </span>
                                <span>{percentage}%</span>
                              </div>
                              <react_1.Progress value={percentage} className="h-2"/>
                            </div>
                          </react_router_1.Link>);
                });
            })}
                  </div>
                </div>
              </framer_motion_1.motion.div>
            </div>)}
          <react_router_1.Outlet />
          <script dangerouslySetInnerHTML={{
            __html: "window.env = ".concat(JSON.stringify(env))
        }}/>
        </Document>
      </i18n_1.I18nProvider>
    </react_1.OperatingSystemContextProvider>);
}
function ErrorBoundary(_a) {
    var _b;
    var error = _a.error;
    var message = (0, react_router_1.isRouteErrorResponse)(error)
        ? ((_b = error.data.message) !== null && _b !== void 0 ? _b : error.data)
        : error instanceof Error
            ? error.message
            : String(error);
    return (<Document title="Error!">
      <div className="light">
        <div className="flex flex-col w-full h-screen  items-center justify-center space-y-4 ">
          <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="block max-w-[60px] dark:hidden"/>
          <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="max-w-[60px] hidden dark:block"/>
          <react_1.Heading size="h1">Something went wrong</react_1.Heading>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
          <react_1.Button onClick={function () { return (window.location.href = "/"); }}>
            Back Home
          </react_1.Button>
        </div>
      </div>
    </Document>);
}
