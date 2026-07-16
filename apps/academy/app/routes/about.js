"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AboutRoute;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Hero_1 = require("~/components/Hero");
var config_1 = require("~/config");
var useUser_1 = require("~/hooks/useUser");
var path_1 = require("~/utils/path");
function AboutRoute() {
    var user = (0, useUser_1.useOptionalUser)();
    return (<div className="w-full flex flex-col">
      <Hero_1.Hero>
        <react_1.Heading size="display" className="font-display text-[#121212] dark:text-white max-w-2xl">
          Carbon Academy
        </react_1.Heading>
        <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-lg max-w-2xl">
          Want to take command of your business? Need a quick answer to a
          problem or onboard a new employee? Test your knowledge and track your
          progress.
        </p>
        <div className="flex items-center gap-2">
          {user ? (<react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuCirclePlay />} asChild>
              <react_router_1.Link to={path_1.path.to.lesson(config_1.modules[0].courses[0].topics[0].lessons[0].id)}>
                Begin your first lesson
              </react_router_1.Link>
            </react_1.Button>) : (<react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuCirclePlay />} asChild>
              <react_router_1.Link to={path_1.path.to.login}>Sign up to register</react_router_1.Link>
            </react_1.Button>)}
        </div>
      </Hero_1.Hero>
      <section className="border-b">
        <div className="flex flex-row gap-8 w-full px-4 max-w-5xl mx-auto my-24">
          <div className="flex flex-col max-w-2xl gap-6">
            <h3 className="text-muted-foreground uppercase text-sm font-display leading-[140%] tracking-tighter">
              How it works
            </h3>
            <react_1.Heading size="h1" className="font-display text-[#121212] dark:text-white max-w-2xl">
              Register and Track Your Progress
            </react_1.Heading>
            <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-lg">
              Sign up to track your progress. Then join a course! All courses
              are free, and you can earn your credential(s) for free too.
              Courses in Carbon Academy are designed to build off of each other
              as you follow the recommended path. You can also jump around if
              you'd like to skip ahead on anything.
            </p>
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-row gap-8 w-full px-4 max-w-5xl mx-auto my-24">
          <div className="flex flex-col max-w-2xl gap-6">
            <h3 className="text-muted-foreground uppercase text-sm font-display leading-[140%] tracking-tighter">
              Challenges
            </h3>
            <react_1.Heading size="h1" className="font-display text-[#121212] dark:text-white max-w-2xl">
              Take Challenges
            </react_1.Heading>
            <p className="text-muted-foreground text-balance text-left font-medium tracking-tighter text-lg">
              Put your new Carbon knowledge to the test by taking challenges.
              You'll need to score 100% to pass a challenge, but there is no
              limit on the number of attempts.
            </p>
            <div className="flex items-center gap-2">
              <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuCirclePlay />} asChild>
                <react_router_1.Link to={path_1.path.to.lesson(config_1.modules[0].courses[0].topics[0].lessons[0].id)}>
                  Begin your first lesson
                </react_router_1.Link>
              </react_1.Button>
              <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuCirclePlay />} asChild>
                <react_router_1.Link to={path_1.path.to.login}>Sign up to take challenges</react_router_1.Link>
              </react_1.Button>
            </div>
          </div>
        </div>
      </section>
    </div>);
}
