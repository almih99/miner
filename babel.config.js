const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "14",
        firefox: "3.5",
        chrome: "8",
        safari: "5.0",
        ie: "8",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
