import {
  buildSquareGrid,
  buildTriangularGrid,
  buildHexagonalGrid,
  buildCircularGrid,
} from "./maze.js";
import { drawingSurfaces } from "./drawingSurfaces.js";
import { buildRandom } from "./random.js";
import { algorithms } from "./algorithms.js";
import {
  SHAPE_SQUARE,
  SHAPE_TRIANGLE,
  SHAPE_HEXAGON,
  SHAPE_CIRCLE,
  ALGORITHM_NONE,
} from "./constants.js";

const shapeLookup = {
  [SHAPE_SQUARE]: buildSquareGrid,
  [SHAPE_TRIANGLE]: buildTriangularGrid,
  [SHAPE_HEXAGON]: buildHexagonalGrid,
  [SHAPE_CIRCLE]: buildCircularGrid,
};

function validateConfig(config) {
  if (!config) {
    throw new Error("config object missing");
  }

  if (!config.grid) {
    throw new Error('no "grid" property in config object');
  }

  if (!config.grid.cellShape) {
    throw new Error('no "grid.cellShape" property in config object');
  }

  if (
    ![SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON, SHAPE_CIRCLE].includes(
      config.grid.cellShape
    )
  ) {
    throw new Error('invalid "grid.cellShape" property in config object');
  }

  if (
    [SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON].includes(
      config.grid.cellShape
    )
  ) {
    if (!config.grid.width) {
      throw new Error('missing/invalid "grid.width" property in config object');
    }
    if (!config.grid.height) {
      throw new Error(
        'missing/invalid "grid.height" property in config object'
      );
    }
  } else if (config.grid.cellShape === SHAPE_CIRCLE) {
    if (!config.grid.layers) {
      throw new Error(
        'missing/invalid "grid.layers" property in config object'
      );
    }
  }

  if (![ALGORITHM_NONE].includes(config.algorithm)) {
    throw new Error('missing/invalid "algorithm" property in config object');
  }

  if (!config.element) {
    throw new Error('missing/invalid "element" property in config object');
  }
  if (!["canvas"].includes(config.element.tagName.toLowerCase())) {
    throw new Error(
      'invalid "element" property in config object',
      config.element.tagName.toLowerCase()
    );
  }
}

export function buildMaze(config) {
  validateConfig(config);

  const random = buildRandom(config.randomSeed || Date.now()),
    grid = shapeLookup[config.grid.cellShape]({
      ...config,
      ...config.grid,
      width: config.grid.width,
      height: config.grid.height,
      layers: config.grid.layers,
      exitConfig: config.exitConfig,
      random,
      lineWidth: Math.max(config.lineWidth || 1, 0.1),
      drawingSurface: drawingSurfaces[config.element.tagName.toLowerCase()]({
        el: config.element,
        lineWidth: config.lineWidth,
        openColor: config.grid.openColor,
        closedColor: config.grid.closedColor,
      }),
    }),
    algorithm = algorithms[config.algorithm];

  grid.initialise();
  (config.mask || []).forEach((maskedCoords) => {
    grid.removeCell(maskedCoords);
  });

  const iterator = algorithm.fn(grid, { random });
  grid.runAlgorithm = {
    toCompletion() {
      while (!iterator.next().done);
    },
  };

  return grid;
}
