"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImageDrop = exports.handleImagePaste = exports.createImageUpload = exports.UploadImagesPlugin = void 0;
var state_1 = require("@tiptap/pm/state");
var view_1 = require("@tiptap/pm/view");
var uploadKey = new state_1.PluginKey("upload-image");
var UploadImagesPlugin = function (_a) {
    var imageClass = _a.imageClass;
    return new state_1.Plugin({
        key: uploadKey,
        state: {
            init: function () {
                return view_1.DecorationSet.empty;
            },
            apply: function (tr, set) {
                set = set.map(tr.mapping, tr.doc);
                // See if the transaction adds or removes any placeholders
                var action = tr.getMeta(uploadKey);
                if (action === null || action === void 0 ? void 0 : action.add) {
                    var _a = action.add, id = _a.id, pos = _a.pos, src = _a.src;
                    var placeholder = document.createElement("div");
                    placeholder.setAttribute("class", "img-placeholder");
                    var image = document.createElement("img");
                    image.setAttribute("class", imageClass);
                    image.src = src;
                    placeholder.appendChild(image);
                    var deco = view_1.Decoration.widget(pos + 1, placeholder, {
                        id: id
                    });
                    set = set.add(tr.doc, [deco]);
                }
                else if (action === null || action === void 0 ? void 0 : action.remove) {
                    set = set.remove(set.find(undefined, undefined, function (spec) { return spec.id == action.remove.id; }));
                }
                return set;
            }
        },
        props: {
            decorations: function (state) {
                return this.getState(state);
            }
        }
    });
};
exports.UploadImagesPlugin = UploadImagesPlugin;
function findPlaceholder(state, id) {
    var _a;
    var decos = uploadKey.getState(state);
    var found = decos.find(undefined, undefined, function (spec) { return spec.id == id; });
    return found.length ? (_a = found[0]) === null || _a === void 0 ? void 0 : _a.from : null;
}
var createImageUpload = function (_a) {
    var validateFn = _a.validateFn, onUpload = _a.onUpload;
    return function (file, view, pos) {
        // check if the file is an image
        var validated = validateFn === null || validateFn === void 0 ? void 0 : validateFn(file);
        if (!validated)
            return;
        // A fresh object to act as the ID for this upload
        var id = {};
        // Replace the selection with a placeholder
        var tr = view.state.tr;
        if (!tr.selection.empty)
            tr.deleteSelection();
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            tr.setMeta(uploadKey, {
                add: {
                    id: id,
                    pos: pos,
                    src: reader.result
                }
            });
            view.dispatch(tr);
        };
        onUpload(file).then(function (src) {
            var _a;
            var schema = view.state.schema;
            var pos = findPlaceholder(view.state, id);
            // If the content around the placeholder has been deleted, drop
            // the image
            if (pos == null)
                return;
            // Otherwise, insert it at the placeholder's position, and remove
            // the placeholder
            // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
            // the image locally
            var imageSrc = typeof src === "object" ? reader.result : src;
            var node = (_a = schema.nodes.image) === null || _a === void 0 ? void 0 : _a.create({ src: imageSrc });
            if (!node)
                return;
            var transaction = view.state.tr
                .replaceWith(pos, pos, node)
                .setMeta(uploadKey, { remove: { id: id } });
            view.dispatch(transaction);
        }, function () {
            // Deletes the image placeholder on error
            var transaction = view.state.tr
                .delete(pos, pos)
                .setMeta(uploadKey, { remove: { id: id } });
            view.dispatch(transaction);
        });
    };
};
exports.createImageUpload = createImageUpload;
var handleImagePaste = function (view, event, uploadFn) {
    var _a;
    if ((_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.files.length) {
        event.preventDefault();
        var file = Array.from(event.clipboardData.files)[0];
        var pos = view.state.selection.from;
        if (file)
            uploadFn(file, view, pos);
        return true;
    }
    return false;
};
exports.handleImagePaste = handleImagePaste;
var handleImageDrop = function (view, event, moved, uploadFn) {
    var _a, _b;
    if (!moved && ((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.files.length)) {
        event.preventDefault();
        var file = Array.from(event.dataTransfer.files)[0];
        var coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
        });
        // here we deduct 1 from the pos or else the image will create an extra node
        if (file)
            uploadFn(file, view, (_b = coordinates === null || coordinates === void 0 ? void 0 : coordinates.pos) !== null && _b !== void 0 ? _b : 0 - 1);
        return true;
    }
    return false;
};
exports.handleImageDrop = handleImageDrop;
