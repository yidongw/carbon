"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseLayout;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Hero_1 = require("~/components/Hero");
var config_1 = require("~/config");
var useUser_1 = require("~/hooks/useUser");
var path_1 = require("~/utils/path");
function CourseLayout() {
    var user = (0, useUser_1.useOptionalUser)();
    return (<div className="w-full flex flex-col">
      {user === null && (<Hero_1.Hero>
          <react_1.Heading size="h1" className="font-display text-[#121212] dark:text-white max-w-xl">
            Your Journey Starts Here
          </react_1.Heading>
          <p className="text-muted-foreground dark:text-foreground text-balance text-left font-medium tracking-tighter text-lg max-w-xl">
            Learn the basics of Carbon and start your journey to becoming an
            expert in Carbon. All for free.
          </p>
          <div className="flex items-center gap-2">
            <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuCirclePlay />} asChild>
              <react_router_1.Link to={path_1.path.to.lesson(config_1.modules[0].courses[0].topics[0].lessons[0].id)}>
                Begin your first lesson
              </react_router_1.Link>
            </react_1.Button>
            <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuBookOpen />} asChild>
              <react_router_1.Link to={path_1.path.to.about}>See how it works</react_router_1.Link>
            </react_1.Button>
          </div>
        </Hero_1.Hero>)}
      <div className="w-full px-4 max-w-5xl mx-auto my-16">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <nav className="space-y-4">
            {config_1.modules.map(function (module) { return (<div key={module.id} className="space-y-2">
                <h3 className="font-display font-bold uppercase text-xs" style={{ color: module.background }}>
                  {module.name}
                </h3>
                <div className="space-y-0">
                  {module.courses.map(function (course) { return (<react_router_1.NavLink key={course.id} to={path_1.path.to.course(module.id, course.id)} className={function (_a) {
                    var isActive = _a.isActive;
                    return [
                        "block py-1.5 px-2 text-sm rounded-md border-l-2 transition-all hover:underline",
                        isActive
                            ? "font-semibold text-foreground"
                            : "text-foreground/80 border-l-transparent hover:bg-accent/60 hover:text-foreground"
                    ].join(" ");
                }} style={function (_a) {
                    var isActive = _a.isActive;
                    return isActive
                        ? {
                            backgroundColor: "".concat(module.background, "2E"),
                            borderLeftColor: module.background,
                            boxShadow: "inset 0 0 0 1px ".concat(module.background, "4D")
                        }
                        : undefined;
                }}>
                      {course.name}
                    </react_router_1.NavLink>); })}
                </div>
              </div>); })}
          </nav>
          <main>
            <react_router_1.Outlet />
          </main>
        </div>
      </div>
    </div>);
}
