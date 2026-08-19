// `astronomia` (MIT, pure-JS VSOP87 astronomy library) ships no type
// declarations at all -- ambient wildcard module so TS treats every subpath
// import as `any` instead of a hard error. Values are used carefully and
// cross-checked against the library's own JSDoc comments at the call sites
// in westernChart.ts.
declare module "astronomia/*";
declare module "astronomia";
