"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tooltip_1 = require("../../Tooltip");
var BlockQuote_1 = require("./BlockQuote");
var Bold_1 = require("./Bold");
var Code_1 = require("./Code");
var CodeBlock_1 = require("./CodeBlock");
var Heading_1 = require("./Heading");
var HorizontalRule_1 = require("./HorizontalRule");
var Italic_1 = require("./Italic");
var OrderedList_1 = require("./OrderedList");
var Paragraph_1 = require("./Paragraph");
var Strike_1 = require("./Strike");
var UnorderedList_1 = require("./UnorderedList");
var Toolbar = function (_a) {
    var editor = _a.editor;
    return (<Tooltip_1.TooltipProvider>
      <div className="w-full border-b border-border p-2">
        <div className="flex flex-wrap gap-2">
          <Paragraph_1.default editor={editor}/>
          <Heading_1.HeadingOne editor={editor}/>
          <Heading_1.HeadingTwo editor={editor}/>
          <Heading_1.HeadingThree editor={editor}/>

          {/* Inline styles */}
          <Bold_1.default editor={editor}/>
          <Italic_1.default editor={editor}/>
          <Strike_1.default editor={editor}/>
          <Code_1.default editor={editor}/>

          {/* Block styles */}
          <UnorderedList_1.default editor={editor}/>
          <OrderedList_1.default editor={editor}/>
          <CodeBlock_1.default editor={editor}/>
          <BlockQuote_1.default editor={editor}/>
          <HorizontalRule_1.default editor={editor}/>
        </div>
      </div>
    </Tooltip_1.TooltipProvider>);
};
exports.default = Toolbar;
