"use strict";

const crypto = require("node:crypto");

function getAllHeaders(event) {
    // Support proxy integration, and your mapping-template integration
    return (
        event?.headers ||
        event?.params?.header ||
        event?.params?.headers || // just in case
        {}
    );
}

function getHeader(headers, name) {
    if (!headers) return undefined;

    // Handle various casing; your current object uses Title-Case keys
    const target = name.toLowerCase();

    for (const [k, v] of Object.entries(headers)) {
        if (String(k).toLowerCase() === target) return v;
    }
    return undefined;
}

function makePublicKey(keyValue) {
    const s = String(keyValue).trim();

    // If it's PEM (includes header), normalize newlines and parse as PEM
    if (s.includes("BEGIN PUBLIC KEY") || s.includes("BEGIN EC PUBLIC KEY")) {
        const pem = s.includes("\\n") ? s.replace(/\\n/g, "\n") : s;
        return crypto.createPublicKey(pem);
    }

    // Otherwise assume it's base64 DER (SPKI)
    const der = Buffer.from(s, "base64");
    return crypto.createPublicKey({ key: der, format: "der", type: "spki" });
}

function toBodyBuffer(event) {
    // BEST CASE (proxy integration or you mapped it): raw string body preserved
    if (typeof event.body === "string") {
        return event.isBase64Encoded
            ? Buffer.from(event.body, "base64")
            : Buffer.from(event.body, "utf8");
    }

    if (typeof event.rawBody === "string") {
        return Buffer.from(event.rawBody, "utf8");
    }

    // FALLBACK: mapping template already parsed JSON into body-json
    // WARNING: this might not match exact bytes SendGrid signed.
    if (event["body-json"] !== undefined) {
        return Buffer.from(JSON.stringify(event["body-json"]), "utf8");
    }

    return Buffer.from("", "utf8");
}

function verifySendgridSignature(event, opts = {}) {
    const {
        signatureTimeout = 6000,
        publicKeyPem = process.env.SENDGRID_VERIFY_KEY,
        requireSignatureHeaders = true,
    } = opts;

    if (!publicKeyPem) {
        return { ok: false, reason: "Missing SENDGRID_VERIFY_KEY", statusCode: 500 };
    }

    const headers = getAllHeaders(event);
    const signatureB64 = getHeader(headers, "X-Twilio-Email-Event-Webhook-Signature");
    const timestamp = getHeader(headers, "X-Twilio-Email-Event-Webhook-Timestamp");

    if (!signatureB64 || !timestamp) {
        if (requireSignatureHeaders) {
            return { ok: false, reason: "Missing signature headers", statusCode: 401 };
        }
        return { ok: true };
    }

    // Replay protection
    const nowSec = Math.floor(Date.now() / 1000);
    const tsSec = Number(timestamp);

    if (!Number.isFinite(tsSec) || Math.abs(nowSec - tsSec) > signatureTimeout) {
        return { ok: false, reason: "Stale timestamp", statusCode: 401 };
    }

    let signature;
    try {
        signature = Buffer.from(String(signatureB64), "base64");
    } catch {
        return { ok: false, reason: "Bad signature base64", statusCode: 401 };
    }

    const bodyBuf = toBodyBuffer(event);
    const payload = Buffer.concat([Buffer.from(String(timestamp), "utf8"), bodyBuf]);

    try {
        const publicKey = makePublicKey(publicKeyPem);
        const ok = crypto.verify("sha256", payload, publicKey, signature);
        if (!ok) return { ok: false, reason: "Invalid signature", statusCode: 401 };
        return { ok: true };
    } catch (e) {
        return { ok: false, reason: `Verify error: ${e.message}`, statusCode: 401 };
    }
}

module.exports = { verifySendgridSignature };
