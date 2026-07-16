"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var class_variance_authority_1 = require("class-variance-authority");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var path_1 = require("~/utils/path");
var Icons_1 = require("./Icons");
var containerVariants = (0, class_variance_authority_1.cva)("relative flex-shrink-0 overflow-hidden rounded-lg bg-muted", {
    variants: {
        size: {
            sm: "size-8",
            md: "size-10",
            lg: "size-11 bg-gradient-to-bl from-muted to-muted/40",
            xl: "size-16 bg-gradient-to-bl from-muted to-muted/40"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var placeholderVariants = (0, class_variance_authority_1.cva)("flex items-center justify-center", {
    variants: {
        size: {
            sm: "p-1",
            md: "p-1.5",
            lg: "p-2",
            xl: "p-2.5"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var iconVariants = (0, class_variance_authority_1.cva)("text-[#AAAAAA] dark:text-[#444]", {
    variants: {
        size: {
            sm: "w-4 h-4",
            md: "w-5 h-5",
            lg: "w-6 h-6",
            xl: "w-8 h-8"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var getCoverScale = function (img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    if (!ctx || canvas.width === 0 || canvas.height === 0) {
        return 1;
    }
    ctx.drawImage(img, 0, 0);
    var _a = ctx.getImageData(0, 0, canvas.width, canvas.height), data = _a.data, width = _a.width, height = _a.height;
    var minX = width;
    var minY = height;
    var maxX = 0;
    var maxY = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var i = (y * width + x) * 4;
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var a = data[i + 3];
            var isEmpty = a < 16 || (r > 235 && g > 235 && b > 235 && Math.abs(r - g) < 20);
            if (!isEmpty) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }
    if (maxX < minX || maxY < minY) {
        return 1;
    }
    var fillW = (maxX - minX + 1) / width;
    var fillH = (maxY - minY + 1) / height;
    var fill = Math.min(fillW, fillH);
    if (fill >= 0.98 || fill <= 0) {
        return 1;
    }
    return Math.min(1 / fill, 3);
};
var ItemThumbnail = function (_a) {
    var thumbnailPath = _a.thumbnailPath, type = _a.type, _b = _a.size, size = _b === void 0 ? "md" : _b;
    var _c = (0, react_2.useState)(1), coverScale = _c[0], setCoverScale = _c[1];
    return thumbnailPath ? (<div className={containerVariants({ size: size })}>
      <img alt="thumbnail" className="absolute inset-0 size-full object-cover object-center" src={(0, path_1.getPrivateUrl)(thumbnailPath)} style={{
            transform: coverScale === 1 ? undefined : "scale(".concat(coverScale, ")"),
            transformOrigin: "center"
        }} onLoad={function (event) {
            setCoverScale(getCoverScale(event.currentTarget));
        }}/>
    </div>) : (<div className={(0, react_1.cn)(containerVariants({ size: size }), placeholderVariants({ size: size }))}>
      {type ? (<Icons_1.MethodItemTypeIcon className={iconVariants({ size: size })} type={type}/>) : (<lu_1.LuSquareStack className={iconVariants({ size: size })}/>)}
    </div>);
};
exports.default = ItemThumbnail;
