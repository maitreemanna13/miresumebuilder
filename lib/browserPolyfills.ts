import { Buffer } from "buffer";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// @react-pdf/renderer's browser bundle references Node's `Buffer` global
// directly; modern bundlers (webpack5+, Turbopack) don't auto-polyfill it
// like older tooling did, so without this the PDF viewer throws
// `ReferenceError: Buffer is not defined` at render time.
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

export {};
