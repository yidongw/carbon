"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nav = Nav;
var react_1 = require("@carbon/react");
var ThemeToggle_1 = require("./ThemeToggle");
function Nav() {
    return (
    // z-40 keeps the nav above page content but below the z-50 screenshot lightbox.
    <header className="sticky top-0 z-40 h-[68px] flex items-center bg-[var(--canvas-blur)] backdrop-blur-[12px] saturate-[160%] border-b border-border">
      <div className="container flex items-center gap-[26px] w-full">
        <a className="flex items-center gap-[9px] font-semibold text-base tracking-[-0.02em]" href="/">
          <img className="h-[23px] w-auto block dark:hidden" src="/carbon-word-light.svg" alt="Carbon"/>
          <img className="h-[23px] w-auto hidden dark:block" src="/carbon-word-dark.svg" alt="Carbon"/>
        </a>
        <div className="ml-auto flex items-center gap-[10px]">
          <ThemeToggle_1.ThemeToggle />
          <react_1.Button asChild variant="primary" size="md">
            <a href="/x/settings/api-keys">Get an API key</a>
          </react_1.Button>
        </div>
      </div>
    </header>);
}
