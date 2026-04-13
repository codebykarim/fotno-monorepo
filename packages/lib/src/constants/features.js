"use strict";
// ─── Single source of truth for plan features ───────────────────────
// Every app (backend, dashboard, admin, landing, seed) must import from here.
// When you add/remove/rename a feature, this is the ONLY file you touch.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIER_FEATURES = exports.FEATURE_LABELS = exports.FEATURE_KEYS = void 0;
exports.featureLabel = featureLabel;
exports.FEATURE_KEYS = [
    "UNLIMITED_GALLERIES",
    "CLIENT_FAVORITES",
    "COMMENTS",
    "PASSWORD_PROTECTION",
    "CUSTOM_SLUGS",
    "SLIDESHOW_SHARING",
    "DOWNLOAD",
    "GOOGLE_IMPORT",
    "SMART_ALBUMS",
    "CUSTOM_DOMAINS",
    "WEBSITE_BUILDER",
    "ANALYTICS",
];
/** Human-readable labels for every feature key */
exports.FEATURE_LABELS = {
    UNLIMITED_GALLERIES: "Unlimited galleries",
    CLIENT_FAVORITES: "Client favorites & notes",
    COMMENTS: "Gallery comments",
    PASSWORD_PROTECTION: "Password-protected galleries",
    CUSTOM_SLUGS: "Custom gallery slugs",
    SLIDESHOW_SHARING: "Slideshow & social sharing",
    DOWNLOAD: "Download Gallery",
    GOOGLE_IMPORT: "Google Drive & Google Photos import",
    SMART_ALBUMS: "Smart albums",
    CUSTOM_DOMAINS: "Custom domains",
    WEBSITE_BUILDER: "Website builder",
    ANALYTICS: "Gallery analytics",
};
/** Default feature mapping per tier label — used as fallback when DB has no TierFeature rows */
exports.DEFAULT_TIER_FEATURES = {
    Free: [
        "CLIENT_FAVORITES",
        "PASSWORD_PROTECTION",
        "DOWNLOAD",
    ],
    Solo: [
        "UNLIMITED_GALLERIES",
        "CLIENT_FAVORITES",
        "COMMENTS",
        "PASSWORD_PROTECTION",
        "CUSTOM_SLUGS",
        "SLIDESHOW_SHARING",
        "DOWNLOAD",
        "ANALYTICS",
    ],
    Studio: [
        "UNLIMITED_GALLERIES",
        "CLIENT_FAVORITES",
        "COMMENTS",
        "PASSWORD_PROTECTION",
        "CUSTOM_SLUGS",
        "SLIDESHOW_SHARING",
        "DOWNLOAD",
        "GOOGLE_IMPORT",
        "SMART_ALBUMS",
        "ANALYTICS",
    ],
    Unlimited: [
        "UNLIMITED_GALLERIES",
        "CLIENT_FAVORITES",
        "COMMENTS",
        "PASSWORD_PROTECTION",
        "CUSTOM_SLUGS",
        "SLIDESHOW_SHARING",
        "DOWNLOAD",
        "GOOGLE_IMPORT",
        "SMART_ALBUMS",
        "CUSTOM_DOMAINS",
        "WEBSITE_BUILDER",
        "ANALYTICS",
    ],
};
/**
 * Resolve the human-readable label for a feature key.
 * Returns the key itself if not found (safe fallback).
 */
function featureLabel(key) {
    return exports.FEATURE_LABELS[key] ?? key;
}
