export const COLOR_MAPPINGS: {
  [key: string]: string | { colors: string[]; pattern: string };
} = {
  // Basic colors
  bottle: "#174835", // Dark green
  navy: "#000080",
  royal: "#4169E1", // Royal blue
  cardinal: "#C41E3A", // Cardinal red
  maroon: "#800000",
  kelly: "#4CBB17", // Kelly green
  forest: "#228B22", // Forest green
  burgundy: "#800020",
  purple: "#800080",
  brown: "#964B00",
  coffee: "#ad672d",
  denim: "#1f315c",
  raspberry: "#87234b",
  army_brown: "#756649",
  army_green: "#273808",
  mustard: "#E4B44C",
  coral_red: "#e01969",
  coral_melange: "#fc033d",
  bottle_melange: "#024f30",
  oatmeal_melange: "#848786",
  charcoal: "#575656",
  charcoal_charcoal: "#adb1ba",
  stone: "#edda85",
  ruby_red: "#c70230",
  graphite_grey: "#373e4f",
  grey_melange: "#adb1ba",
  dark_grey: "#575d66",
  bark_brown: "#242625",
  navy_melange: "#222940",
  burgundy_melange: "#61291c",
  charcoal_melange: "#5e6063",
  royal_melange: "#10316e",
  emerald: "#21c46b",
  lilac: "#e8b6f0",
  lemon: "#ede18e",
  peach: "#ffc59c",
  mint_green: "#9ff5d1",
  slate_grey: "#454a48",
  sky_blue: "#9dd6f2",
  steel_grey: "#5c554e",
  powder_blue: "#3bd5f7",
  airforce_blue: "#23799e",
  cyber_lime: "#e4f73b",
  cyber_pink: "#e00284",
  cyber_yellow: "#d9f505",
  cyber_orange: "#fc630a",
  red_melange: "#c72842",
  pink_melange: "#fa8cbf",
  military_melange: "#525c4d",
  lumo_yellow: "#e2f720",
  lumo_orange: "#fc8403",

  dusty_pink: "#BF8177",
  burnt_orange: "#d1562a",
  khaki: "#9e9365",
  dark_khaki: "#917e67",
  sand: "#cfb688",
  military_green: "#3c4229",
  military_brown: "#915e20",
  camel: "#75655b",
  fuchsia: "#e84869",

  //Leisure collection

  // Athletic colors
  athletic_gold: "#FFB81C",
  vegas_gold: "#C5B358",

  // Metallic colors
  graphite: "#383838",
  silver: "#C0C0C0",

  // Special materials
  heather: "#9CA5AE", // Heather gray
  oxford: "#EFEFEF", // Light gray

  //baseball:
  grey_black: {
    colors: ["#666666", "#222222"],
    pattern: "camo",
  },
  grey_white: {
    colors: ["#666666", "#fcfcfc"],
    pattern: "camo",
  },
  charcoal_white: {
    colors: ["#43474a", "#fcfcfc"],
    pattern: "camo",
  },
  white_black: {
    colors: ["#fcfcfc", "#0a0a09"],
    pattern: "camo",
  },
  black_white: {
    colors: ["#0a0a09", "#fcfcfc"],
    pattern: "camo",
  },
  khaki_bottle: {
    colors: ["#9e9365", "#104008"],
    pattern: "camo",
  },
  khaki_black: {
    colors: ["#9e9365", "#0a0a09"],
    pattern: "camo",
  },
  khaki_navy: {
    colors: ["#9e9365", "#000080"],
    pattern: "camo",
  },
  black_orange: {
    colors: ["#0a0a09", "#fc8403"],
    pattern: "camo",
  },
  red_white: {
    colors: ["#c72842", "#fcfcfc"],
    pattern: "camo",
  },
  navy_yellow: {
    colors: ["#000080", "#e4f73b"],
    pattern: "camo",
  },
  navy_red: {
    colors: ["#000080", "#c72842"],
    pattern: "camo",
  },
  black_red: {
    colors: ["#0a0a09", "#c72842"],
    pattern: "camo",
  },
  royal_white: {
    colors: ["#4169E1", "#fcfcfc"],
    pattern: "camo",
  },
  navy_white: {
    colors: ["#000080", "#fcfcfc"],
    pattern: "camo",
  },

  //signature collection
  grey_melange_charcoal: {
    colors: ["#43474a", "#adb1ba"],
    pattern: "camo",
  },
  grey_melange_black: {
    colors: ["#0a0a09", "#adb1ba"],
    pattern: "camo",
  },
  melange_black: {
    colors: ["#0a0a09", "#adb1ba"],
    pattern: "camo",
  },

  //african collection
  burnt_orange_grey: {
    colors: ["#d1562a", "#adb1ba"],
    pattern: "camo",
  },

  //fashion collection
  charcoal_khaki: {
    colors: ["#9e9365", "#43474a"],
    pattern: "camo",
  },
  grey_khaki: {
    colors: ["#9e9365", "#adb1ba"],
    pattern: "camo",
  },
  denim_khaki: {
    colors: ["#9e9365", "#1f315c"],
    pattern: "camo",
  },
  olive_khaki: {
    colors: ["#9e9365", "#768563"],
    pattern: "camo",
  },
  mustard_khaki: {
    colors: ["#9e9365", "#E4B44C"],
    pattern: "camo",
  },
  bottle_khaki: {
    colors: ["#9e9365", "#104008"],
    pattern: "camo",
  },
  raspberry_khaki: {
    colors: ["#9e9365", "#80365e"],
    pattern: "camo",
  },
  cobalt_blue_khaki: {
    colors: ["#9e9365", "#28698a"],
    pattern: "camo",
  },
  khaki_khaki: {
    colors: ["#9e9365", "#6b6143"],
    pattern: "camo",
  },
  charcoal_white_black: {
    colors: ["#43474a", "#fcfcfc", "#0a0a09"],
    pattern: "camo",
  },
  royal_white_navy: {
    colors: ["#000080", "#4169E1", "#fcfcfc"],
    pattern: "camo",
  },
  navy_white_burgundy: {
    colors: ["#000080", "#800020", "#fcfcfc"],
    pattern: "camo",
  },
  powder_white_navy: {
    colors: ["#000080", "#3bd5f7", "#fcfcfc"],
    pattern: "camo",
  },
  red_white_navy: {
    colors: ["#000080", "#c72842", "#fcfcfc"],
    pattern: "camo",
  },
  royal_white_red: {
    colors: ["#4169E1", "#c72842", "#fcfcfc"],
    pattern: "camo",
  },
  purple_white_black: {
    colors: ["#512f70", "#0a0a09", "#fcfcfc"],
    pattern: "camo",
  },
  yellow_white_black: {
    colors: ["#e4f73b", "#0a0a09", "#fcfcfc"],
    pattern: "camo",
  },
  kelly_green_white: {
    colors: ["#4CBB17", "#fcfcfc"],
    pattern: "camo",
  },
  orange_white: {
    colors: ["#f07205", "#fcfcfc"],
    pattern: "camo",
  },
  burgundy_white: {
    colors: ["#800020", "#fcfcfc"],
    pattern: "camo",
  },
  olive_black: {
    colors: ["#768563", "#0a0a09"],
    pattern: "camo",
  },
  red_black: {
    colors: ["#c72842", "#0a0a09"],
    pattern: "camo",
  },
  charcoal_black: {
    colors: ["#343942", "#0a0a09"],
    pattern: "camo",
  },
  grey_grey: {
    colors: ["#343942", "#adb1ba"],
    pattern: "camo",
  },
  olive_stone: {
    colors: ["#edda85", "#768563"],
    pattern: "camo",
  },
  fuchsia_black: {
    colors: ["#ad0e5e", "#0a0a09"],
    pattern: "camo",
  },
  orange_navy: {
    colors: ["#f27907", "#000080"],
    pattern: "camo",
  },
  black_grey: {
    colors: ["#adb1ba", "#0a0a09"],
    pattern: "camo",
  },

  //sport collection
  south_africa_green: "#03731f",
  south_africa: {
    colors: ["#f0be1a", "#080707", "#03731f", "#fafafa", "#a10c0a", "#0a25a1"],
    pattern: "camo",
  },
  south_africa_arrow: {
    colors: ["#f0be1a", "#080707", "#03731f", "#fafafa", "#a10c0a", "#0a25a1"],
    pattern: "camo",
  },
  sa_flag: {
    colors: ["#f0be1a", "#080707", "#03731f", "#fafafa", "#a10c0a", "#0a25a1"],
    pattern: "camo",
  },

  //summer collection
  rainbow: {
    colors: ["#d1562a", "#8f1073", "#1594c2", "#40803e"],
    pattern: "camo",
  },
  ocean: {
    colors: ["#5ea0cc", "#2c558a", "#fcfcfc"],
    pattern: "camo",
  },
  tropical: {
    colors: ["#29cae3", "#4cd473", "#fcfcfc"],
    pattern: "camo",
  },
  swirl: {
    colors: ["#29cae3", "#40803e", "#fcfcfc", "#8f1073", "#d1562a"],
    pattern: "camo",
  },

  //camo category:
  autumn_camo: {
    colors: ["#D2B48C", "#964B00", "#2e3b20"],
    pattern: "camo",
  },
  camo_black: {
    colors: ["#0a0a09", "#a6a698", "#4d4d49", "#fcfcfc"],
    pattern: "camo",
  },
  camo_green: {
    colors: ["#0a0a09", "#804106", "#104008", "#D2B48C"],
    pattern: "camo",
  },
  camo_blue: {
    colors: ["#0a0a09", "#537ba3", "#2d4d6e", "#84a4c4"],
    pattern: "camo",
  },
  camo_orange: {
    colors: ["#f27907", "#804106", "#f5a55b", "#0a0a09"],
    pattern: "camo",
  },
  woodland_camo: {
    colors: ["#706551", "#2d3b28", "#6c7868", "#a2ad9e"],
    pattern: "camo",
  },
  pixel_camo: {
    colors: ["#bfc4bc", "#104008", "#6c7868"],
    pattern: "camo",
  },
  camo_brown: {
    colors: ["#3b2e1a", "#b3a288", "#59554e"],
    pattern: "camo",
  },
  camo_pink: {
    colors: ["#d41e97", "#d481b8", "#343434", "#fcfcfc"],
    pattern: "camo",
  },
  forrest_camo: {
    colors: ["#4a4033", "#948776", "#5c5b3c", "#2e3b20"],
    pattern: "camo",
  },
  forrest_camo_black: {
    colors: ["#4a4033", "#948776", "#5c5b3c", "#2e3b20"],
    pattern: "camo",
  },
};
