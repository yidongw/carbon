"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var HTML_1 = require("@carbon/react/HTML");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var RichText_1 = require("~/components/Form/RichText");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var RichText = function (_a) {
    var documentId = _a.documentId, notes = _a.notes;
    var formatTimeAgo = (0, hooks_1.useDateFormatter)().formatTimeAgo;
    var user = (0, hooks_1.useUser)();
    var permissions = (0, hooks_1.usePermissions)();
    var isEmployee = permissions.is("employee");
    if (!isEmployee)
        return null;
    return (<>
      {notes.length > 0 ? (<div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-8 w-full">
          {notes.map(function (note) {
                var _a, _b;
                if (!note.user || Array.isArray(note.user))
                    throw new Error("Invalid user");
                return (<react_2.Fragment key={note.id}>
                {/* @ts-ignore */}
                <components_1.Avatar path={note.user.avatarUrl} name={(_a = note.user) === null || _a === void 0 ? void 0 : _a.fullName}/>
                <react_1.VStack spacing={1}>
                  {/* @ts-ignore */}
                  <p className="font-bold">{(_b = note.user) === null || _b === void 0 ? void 0 : _b.fullName}</p>
                  <HTML_1.HTML text={note.note}/>
                  <react_1.HStack spacing={4}>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(note.createdAt)}
                    </span>
                    {/* @ts-ignore */}
                    {user.id === note.user.id && (<react_router_1.Form method="post" action={path_1.path.to.deleteNote(note.id)}>
                        <react_1.Button type="submit" variant="link" size="md">
                          <macro_1.Trans>Delete</macro_1.Trans>
                        </react_1.Button>
                      </react_router_1.Form>)}
                  </react_1.HStack>
                </react_1.VStack>
              </react_2.Fragment>);
            })}
        </div>) : (<div className="text-muted-foreground p-4 w-full text-center">
          <macro_1.Trans>No notes</macro_1.Trans>
        </div>)}

      <div className="pt-8 w-full">
        <form_1.ValidatedForm method="post" action={path_1.path.to.newNote} resetAfterSubmit validator={shared_1.noteValidator}>
          <Form_1.Hidden name="documentId" value={documentId}/>
          <react_1.VStack spacing={3}>
            <div className="w-full border border-border rounded-md">
              <RichText_1.default name="note" className="min-h-[160px]"/>
            </div>
            <div className="flex justify-end w-full">
              <Form_1.Submit withBlocker={false}>
                <macro_1.Trans>Add Note</macro_1.Trans>
              </Form_1.Submit>
            </div>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </div>
    </>);
};
exports.default = RichText;
