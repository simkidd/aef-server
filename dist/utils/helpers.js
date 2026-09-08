"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
exports.generateSlug = generateSlug;
function slugify(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
function generateSlug(name) {
    const shortId = Math.random().toString(36).substring(2, 6);
    return `${slugify(name)}-${shortId}`;
}
//# sourceMappingURL=helpers.js.map