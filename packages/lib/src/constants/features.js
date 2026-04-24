"use strict";
// ─── Single source of truth for plan features ───────────────────────
// Every app (backend, dashboard, admin, landing, seed) must import from here.
// When you add/remove/rename a feature, this is the ONLY file you touch.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIER_FEATURES = exports.FEATURE_BLURBS = exports.FEATURE_LABELS = exports.FEATURE_KEYS = void 0;
exports.featureLabel = featureLabel;
exports.featureBlurb = featureBlurb;
exports.FEATURE_KEYS = [
    "UNLIMITED_GALLERIES",
    "CLIENT_FAVORITES",
    "COMMENTS",
    "PASSWORD_PROTECTION",
    "CUSTOM_SLUGS",
    "SLIDESHOW_SHARING",
    "DOWNLOAD",
    "GOOGLE_IMPORT",
    "ALBUMS",
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
    ALBUMS: "Albums",
    SMART_ALBUMS: "Print Albums",
    CUSTOM_DOMAINS: "Custom domains",
    WEBSITE_BUILDER: "Website builder",
    ANALYTICS: "Gallery analytics",
};
/** One-line descriptions for marketing surfaces (landing pricing tiles, upsells) */
exports.FEATURE_BLURBS = {
    UNLIMITED_GALLERIES: "Create as many as you need. No caps.",
    CLIENT_FAVORITES: "Clients star and comment, you get a shortlist.",
    COMMENTS: "Threaded feedback pinned to each photo.",
    PASSWORD_PROTECTION: "Lock private sets behind a shared password.",
    CUSTOM_SLUGS: "Share clean, memorable URLs per gallery.",
    SLIDESHOW_SHARING: "Present fullscreen or post-ready in one click.",
    DOWNLOAD: "High-res ZIP downloads for clients and you.",
    GOOGLE_IMPORT: "Pull existing libraries straight into Fotno.",
    ALBUMS: "Organize gallery photos into curated albums.",
    SMART_ALBUMS: "Let clients design and order printed photo albums.",
    CUSTOM_DOMAINS: "Host galleries on your own studio domain.",
    WEBSITE_BUILDER: "Build a portfolio site from your galleries.",
    ANALYTICS: "See views, downloads, and top photos.",
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
        "ALBUMS",
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
        "ALBUMS",
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
        "ALBUMS",
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
/**
 * Resolve the marketing blurb for a feature key.
 * Returns empty string if not found.
 */
function featureBlurb(key) {
    return exports.FEATURE_BLURBS[key] ?? "";
}
