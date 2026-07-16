"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
require("./global.css");
require("./editorial.css");
var next_1 = require("fumadocs-ui/provider/next");
var site_footer_1 = require("@/components/site-footer");
function Layout(_a) {
    var children = _a.children;
    return (<html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fira+Code:wght@400;500;600&display=swap"/>
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        {/* Light-only — the editorial design is a warm paper theme, no dark mode */}
        <next_1.RootProvider theme={{ enabled: false }}>{children}</next_1.RootProvider>
        <site_footer_1.SiteFooter />
      </body>
    </html>);
}
