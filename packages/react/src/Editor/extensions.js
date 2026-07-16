"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultExtensions = void 0;
var tiptap_1 = require("@carbon/tiptap");
var core_1 = require("@tiptap/core");
var extension_table_1 = require("@tiptap/extension-table");
var extension_table_cell_1 = require("@tiptap/extension-table-cell");
var extension_table_header_1 = require("@tiptap/extension-table-header");
var extension_table_row_1 = require("@tiptap/extension-table-row");
var state_1 = require("@tiptap/pm/state");
var class_variance_authority_1 = require("class-variance-authority");
// Video regex patterns
var LOOM_REGEX = /https:\/\/www\.loom\.com\/share\/([a-zA-Z0-9]+)/;
var YOUTUBE_REGEX = /https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9]+)/;
// Custom node for HTML content
var HTMLContent = core_1.Node.create({
    name: "htmlContent",
    group: "block",
    atom: true,
    selectable: true,
    draggable: true,
    addAttributes: function () {
        return {
            html: {
                default: ""
            },
            type: {
                default: "loom" // or "youtube"
            }
        };
    },
    parseHTML: function () {
        return [
            {
                tag: "div[data-video-embed]"
            }
        ];
    },
    renderHTML: function (_a) {
        var node = _a.node;
        var container = document.createElement("div");
        container.setAttribute("data-video-embed", node.attrs.type);
        container.setAttribute("tabindex", "0");
        container.className =
            "focus:ring-2 focus:ring-primary hover:bg-zinc-200 dark:hover:bg-zinc-800 p-2 border bg-zinc-100 dark:bg-zinc-900 cursor-move rounded-lg";
        container.innerHTML = node.attrs.html;
        return container;
    }
});
var VideoEmbed = core_1.Extension.create({
    name: "videoEmbed",
    addProseMirrorPlugins: function () {
        return [
            new state_1.Plugin({
                key: new state_1.PluginKey("videoEmbed"),
                props: {
                    handlePaste: function (view, event) {
                        var _a;
                        var text = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData("text/plain");
                        if (!text)
                            return false;
                        var loomMatch = text.match(LOOM_REGEX);
                        var youtubeMatch = text.match(YOUTUBE_REGEX);
                        if (!loomMatch && !youtubeMatch)
                            return false;
                        var embedHtml = "";
                        var videoType = "";
                        if (loomMatch) {
                            var videoId = loomMatch[1];
                            videoType = "loom";
                            embedHtml = "<div><div style=\"position: relative; padding-bottom: 62.5%; height: 0;\"><iframe src=\"https://www.loom.com/embed/".concat(videoId, "\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%;\"></iframe></div></div>");
                        }
                        else if (youtubeMatch) {
                            var videoId = youtubeMatch[1];
                            videoType = "youtube";
                            embedHtml = "<div><div style=\"position: relative; padding-bottom: 56.25%; height: 0;\"><iframe src=\"https://www.youtube.com/embed/".concat(videoId, "\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen style=\"position: absolute; top: 0; left: 0; width: 100%; height: 100%;\"></iframe></div></div>");
                        }
                        // Create an HTML content node
                        var node = view.state.schema.nodes.htmlContent.create({
                            html: embedHtml,
                            type: videoType
                        });
                        var transaction = view.state.tr.replaceSelectionWith(node);
                        view.dispatch(transaction);
                        return true;
                    },
                    handleKeyDown: function (view, event) {
                        // Handle delete/backspace when embed is selected
                        if ((event.key === "Delete" || event.key === "Backspace") &&
                            view.state.selection.empty) {
                            var $pos = view.state.selection.$from;
                            var node = $pos.parent.maybeChild($pos.index());
                            if (node && node.type.name === "htmlContent") {
                                view.dispatch(view.state.tr.delete($pos.pos - $pos.parentOffset, $pos.pos - $pos.parentOffset + node.nodeSize));
                                return true;
                            }
                        }
                        return false;
                    }
                }
            })
        ];
    }
});
var aiHighlight = tiptap_1.AIHighlight;
var placeholder = tiptap_1.Placeholder;
var tiptapLink = tiptap_1.TiptapLink.configure({
    HTMLAttributes: {
        class: (0, class_variance_authority_1.cx)("text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer")
    }
});
var image = tiptap_1.UpdatedImage.extend({
    addProseMirrorPlugins: function () {
        return [
            (0, tiptap_1.UploadImagesPlugin)({
                imageClass: (0, class_variance_authority_1.cx)("opacity-40 rounded-lg border border-stone-200")
            })
        ];
    }
}).configure({
    allowBase64: true,
    HTMLAttributes: {
        class: (0, class_variance_authority_1.cx)("rounded-lg border border-muted")
    }
});
var taskList = tiptap_1.TaskList.configure({
    HTMLAttributes: {
        class: (0, class_variance_authority_1.cx)("not-prose pl-2 ")
    }
});
var taskItem = tiptap_1.TaskItem.configure({
    HTMLAttributes: {
        class: (0, class_variance_authority_1.cx)("flex gap-2 items-start my-4")
    },
    nested: true
});
var horizontalRule = tiptap_1.HorizontalRule.configure({
    HTMLAttributes: {
        class: (0, class_variance_authority_1.cx)("mt-4 mb-6 border-t border-muted-foreground")
    }
});
var starterKit = tiptap_1.StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("list-disc list-outside leading-3 -mt-2")
        }
    },
    orderedList: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("list-decimal list-outside leading-3 -mt-2")
        }
    },
    listItem: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("leading-normal -mb-2")
        }
    },
    blockquote: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("border-l-4 border-primary")
        }
    },
    codeBlock: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium")
        }
    },
    code: {
        HTMLAttributes: {
            class: (0, class_variance_authority_1.cx)("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
            spellcheck: "false"
        }
    },
    horizontalRule: false,
    dropcursor: {
        color: "#DBEAFE",
        width: 4
    },
    gapcursor: false
});
exports.defaultExtensions = [
    starterKit,
    placeholder,
    tiptapLink,
    image,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    tiptap_1.TiptapUnderline,
    VideoEmbed,
    HTMLContent,
    extension_table_1.default,
    extension_table_cell_1.default,
    extension_table_header_1.default,
    extension_table_row_1.default
];
