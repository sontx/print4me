import {
  buildCircularGrid,
  buildHexagonalGrid,
  buildSquareGrid,
  buildTriangularGrid,
} from "./maze.js";
import { drawingSurfaces } from "./drawingSurfaces.js";
import { buildRandom } from "./random.js";
import { algorithms } from "./algorithms.js";
import {
  ALGORITHM_ALDOUS_BRODER,
  ALGORITHM_BINARY_TREE,
  ALGORITHM_ELLERS,
  ALGORITHM_HUNT_AND_KILL,
  ALGORITHM_KRUSKAL,
  ALGORITHM_NONE,
  ALGORITHM_RECURSIVE_BACKTRACK,
  ALGORITHM_SIDEWINDER,
  ALGORITHM_SIMPLIFIED_PRIMS,
  ALGORITHM_TRUE_PRIMS,
  ALGORITHM_WILSON,
  SHAPE_CIRCLE,
  SHAPE_HEXAGON,
  SHAPE_SQUARE,
  SHAPE_TRIANGLE,
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
      config.grid.cellShape,
    )
  ) {
    throw new Error('invalid "grid.cellShape" property in config object');
  }

  if (
    [SHAPE_SQUARE, SHAPE_TRIANGLE, SHAPE_HEXAGON].includes(
      config.grid.cellShape,
    )
  ) {
    if (!config.grid.width) {
      throw new Error('missing/invalid "grid.width" property in config object');
    }
    if (!config.grid.height) {
      throw new Error(
        'missing/invalid "grid.height" property in config object',
      );
    }
  } else if (config.grid.cellShape === SHAPE_CIRCLE) {
    if (!config.grid.layers) {
      throw new Error(
        'missing/invalid "grid.layers" property in config object',
      );
    }
  }

  if (
    ![
      ALGORITHM_NONE,
      ALGORITHM_BINARY_TREE,
      ALGORITHM_SIDEWINDER,
      ALGORITHM_ALDOUS_BRODER,
      ALGORITHM_WILSON,
      ALGORITHM_HUNT_AND_KILL,
      ALGORITHM_RECURSIVE_BACKTRACK,
      ALGORITHM_KRUSKAL,
      ALGORITHM_SIMPLIFIED_PRIMS,
      ALGORITHM_TRUE_PRIMS,
      ALGORITHM_ELLERS,
    ].includes(config.algorithm)
  ) {
    throw new Error('missing/invalid "algorithm" property in config object');
  }
}

export function buildMaze(config) {
  validateConfig(config);

  const random = buildRandom(config.randomSeed || Date.now());
  const grid = shapeLookup[config.grid.cellShape]({
    ...config,
    ...config.grid,
    width: config.grid.width,
    height: config.grid.height,
    layers: config.grid.layers,
    exitConfig: config.exitConfig,
    random,
    lineWidth: Math.max(config.lineWidth || 1, 0.1),
    drawingSurface: drawingSurfaces[config.drawType]({
      el: config.element,
      lineWidth: config.lineWidth,
      openColor: config.grid.openColor,
      closedColor: config.grid.closedColor,
      pathColor: config.grid.pathColor,
    }),
  });
  const algorithm = algorithms[config.algorithm];

  grid.initialise();
  (config.mask || []).forEach((maskedCoords) => {
    grid.removeCell(maskedCoords);
  });

  const iterator = algorithm.fn(grid, { random });
  grid.runAlgorithm = {
    oneStep() {
      return iterator.next().done && (grid.placeExits() || true);
    },
    toCompletion() {
      while (!iterator.next().done);
      grid.placeExits();
    },
  };

  grid.random = random;

  return grid;
}
