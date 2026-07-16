"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSidebar = AppSidebar;
exports.NavMain = NavMain;
exports.NavProjects = NavProjects;
exports.NavSecondary = NavSecondary;
exports.NavUser = NavUser;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
        {
            title: "Models",
            url: "#",
            icon: lu_1.LuBot,
            items: [
                {
                    title: "Genesis",
                    url: "#"
                },
                {
                    title: "Explorer",
                    url: "#"
                },
                {
                    title: "Quantum",
                    url: "#"
                }
            ]
        },
        {
            title: "Documentation",
            url: "#",
            icon: lu_1.LuBookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#"
                },
                {
                    title: "Get Started",
                    url: "#"
                },
                {
                    title: "Tutorials",
                    url: "#"
                },
                {
                    title: "Changelog",
                    url: "#"
                }
            ]
        },
        {
            title: "Settings",
            url: "#",
            icon: lu_1.LuSettings2,
            items: [
                {
                    title: "General",
                    url: "#"
                },
                {
                    title: "Team",
                    url: "#"
                },
                {
                    title: "Billing",
                    url: "#"
                },
                {
                    title: "Limits",
                    url: "#"
                }
            ]
        }
    ],
    navSecondary: [
        {
            title: "Support",
            url: "#",
            icon: lu_1.LuLifeBuoy
        },
        {
            title: "Feedback",
            url: "#",
            icon: lu_1.LuSend
        }
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: lu_1.LuFrame
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: lu_1.LuChartPie
        },
        {
            name: "Travel",
            url: "#",
            icon: lu_1.LuMap
        }
    ]
};
function AppSidebar(_a) {
    var props = __rest(_a, []);
    return (<react_1.Sidebar variant="inset" {...props}>
      <react_1.SidebarHeader>
        <react_1.SidebarMenu>
          <react_1.SidebarMenuItem>
            <react_1.SidebarMenuButton size="lg" asChild>
              <react_router_1.Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <lu_1.LuCommand className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </react_router_1.Link>
            </react_1.SidebarMenuButton>
          </react_1.SidebarMenuItem>
        </react_1.SidebarMenu>
      </react_1.SidebarHeader>
      <react_1.SidebarContent>
        <NavMain items={data.navMain}/>
        <NavProjects projects={data.projects}/>
        <NavSecondary items={data.navSecondary} className="mt-auto"/>
      </react_1.SidebarContent>
      <react_1.SidebarFooter>
        <NavUser user={data.user}/>
      </react_1.SidebarFooter>
    </react_1.Sidebar>);
}
function NavMain(_a) {
    var items = _a.items;
    return (<react_1.SidebarGroup>
      <react_1.SidebarGroupLabel>Platform</react_1.SidebarGroupLabel>
      <react_1.SidebarMenu>
        {items.map(function (item) {
            var _a, _b;
            return (<react_1.Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <react_1.SidebarMenuItem>
              <react_1.SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </react_1.SidebarMenuButton>
              {((_a = item.items) === null || _a === void 0 ? void 0 : _a.length) ? (<>
                  <react_1.CollapsibleTrigger asChild>
                    <react_1.SidebarMenuAction className="data-[state=open]:rotate-90">
                      <lu_1.LuChevronRight />
                      <span className="sr-only">Toggle</span>
                    </react_1.SidebarMenuAction>
                  </react_1.CollapsibleTrigger>
                  <react_1.CollapsibleContent>
                    <react_1.SidebarMenuSub>
                      {(_b = item.items) === null || _b === void 0 ? void 0 : _b.map(function (subItem) { return (<react_1.SidebarMenuSubItem key={subItem.title}>
                          <react_1.SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </react_1.SidebarMenuSubButton>
                        </react_1.SidebarMenuSubItem>); })}
                    </react_1.SidebarMenuSub>
                  </react_1.CollapsibleContent>
                </>) : null}
            </react_1.SidebarMenuItem>
          </react_1.Collapsible>);
        })}
      </react_1.SidebarMenu>
    </react_1.SidebarGroup>);
}
function NavProjects(_a) {
    var projects = _a.projects;
    var isMobile = (0, react_1.useSidebar)().isMobile;
    return (<react_1.SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <react_1.SidebarGroupLabel>Projects</react_1.SidebarGroupLabel>
      <react_1.SidebarMenu>
        {projects.map(function (item) { return (<react_1.SidebarMenuItem key={item.name}>
            <react_1.SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </react_1.SidebarMenuButton>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.SidebarMenuAction showOnHover>
                  <lu_1.LuEllipsis />
                  <span className="sr-only">More</span>
                </react_1.SidebarMenuAction>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent className="w-48" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                <react_1.DropdownMenuItem>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuFolder className="text-muted-foreground"/>}/>
                  <span>View Project</span>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuShare2 className="text-muted-foreground"/>}/>
                  <span>Share Project</span>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash className="text-muted-foreground"/>}/>
                  <span>Delete Project</span>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.SidebarMenuItem>); })}
        <react_1.SidebarMenuItem>
          <react_1.SidebarMenuButton>
            <lu_1.LuEllipsis />
            <span>More</span>
          </react_1.SidebarMenuButton>
        </react_1.SidebarMenuItem>
      </react_1.SidebarMenu>
    </react_1.SidebarGroup>);
}
function NavSecondary(_a) {
    var items = _a.items, props = __rest(_a, ["items"]);
    return (<react_1.SidebarGroup {...props}>
      <react_1.SidebarGroupContent>
        <react_1.SidebarMenu>
          {items.map(function (item) { return (<react_1.SidebarMenuItem key={item.title}>
              <react_1.SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </react_1.SidebarMenuButton>
            </react_1.SidebarMenuItem>); })}
        </react_1.SidebarMenu>
      </react_1.SidebarGroupContent>
    </react_1.SidebarGroup>);
}
function NavUser(_a) {
    var user = _a.user;
    var isMobile = (0, react_1.useSidebar)().isMobile;
    return (<react_1.SidebarMenu>
      <react_1.SidebarMenuItem>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <react_1.Avatar className="h-8 w-8 rounded-lg" src={user.avatar} name={user.name}/>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <lu_1.LuChevronsUpDown className="ml-auto size-4"/>
            </react_1.SidebarMenuButton>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <react_1.DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <react_1.Avatar className="h-8 w-8 rounded-lg" src={user.avatar} name={user.name}/>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </react_1.DropdownMenuLabel>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuGroup>
              <react_1.DropdownMenuItem>
                <react_1.DropdownMenuIcon icon={<lu_1.LuSparkles />}/>
                Upgrade to Pro
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuGroup>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuGroup>
              <react_1.DropdownMenuItem>
                <react_1.DropdownMenuIcon icon={<lu_1.LuBadgeCheck />}/>
                Account
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                Billing
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem>
                <react_1.DropdownMenuIcon icon={<lu_1.LuBell />}/>
                Notifications
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuGroup>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLogOut />}/>
              Log out
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </react_1.SidebarMenuItem>
    </react_1.SidebarMenu>);
}
