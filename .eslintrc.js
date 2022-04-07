// eslint-disable-next-line node/no-unpublished-require
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["@sparticuz/eslint-config"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
};
