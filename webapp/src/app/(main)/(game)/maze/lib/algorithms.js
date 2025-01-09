import {
  ALGORITHM_NONE,
  SHAPE_SQUARE,
  SHAPE_TRIANGLE,
  SHAPE_HEXAGON,
  SHAPE_CIRCLE,
} from "./constants.js";

export const algorithms = {
  [ALGORITHM_NONE]: {
    metadata: {
      description: "Grid",
      maskable: true,
      shapes: [SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON, SHAPE_CIRCLE],
    },
    fn: function* (grid, config) {},
  },
};
