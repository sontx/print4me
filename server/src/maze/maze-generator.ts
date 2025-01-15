import {
  ALGORITHM_ALDOUS_BRODER,
  ALGORITHM_BINARY_TREE,
  ALGORITHM_ELLERS,
  ALGORITHM_HUNT_AND_KILL,
  ALGORITHM_KRUSKAL,
  ALGORITHM_RECURSIVE_BACKTRACK,
  ALGORITHM_SIDEWINDER,
  ALGORITHM_SIMPLIFIED_PRIMS,
  ALGORITHM_TRUE_PRIMS,
  ALGORITHM_WILSON,
  EXITS_HARDEST,
  EXITS_HORIZONTAL,
  EXITS_VERTICAL,
  METADATA_END_CELL,
  METADATA_START_CELL,
  SHAPE_CIRCLE,
  SHAPE_HEXAGON,
  SHAPE_SQUARE,
  SHAPE_TRIANGLE,
} from './lib/constants';
import * as Joi from 'joi';
import { buildMaze } from './lib/main';
import { createCanvas } from 'canvas';
import { JSDOM } from 'jsdom';
import { addWatermark } from '../utils/file-utils';

const TRIANGLE_HEIGHT = Math.sqrt(3) / 2;

interface GridConfig {
  cellShape:
    | typeof SHAPE_SQUARE
    | typeof SHAPE_CIRCLE
    | typeof SHAPE_HEXAGON
    | typeof SHAPE_TRIANGLE;
  width?: number;
  height?: number;
  layers?: number;
  openColor?: string;
  closedColor?: string;
  pathColor?: string;
}

interface IndicatorConfig {
  padding: number;
  start: {
    color: string;
    shape: string;
  };
  end: {
    color: string;
    shape: string;
  };
}

interface BuildMazeConfig {
  grid: GridConfig;
  exitConfig?:
    | typeof EXITS_HARDEST
    | typeof EXITS_HORIZONTAL
    | typeof EXITS_VERTICAL;
  drawType: 'canvas' | 'svg';
  element: any;
  lineWidth?: number;
  randomSeed?: number;
  mask?: Array<[number, number]>;
  algorithm:
    | typeof ALGORITHM_BINARY_TREE
    | typeof ALGORITHM_ALDOUS_BRODER
    | typeof ALGORITHM_SIDEWINDER
    | typeof ALGORITHM_WILSON
    | typeof ALGORITHM_HUNT_AND_KILL
    | typeof ALGORITHM_RECURSIVE_BACKTRACK
    | typeof ALGORITHM_KRUSKAL
    | typeof ALGORITHM_SIMPLIFIED_PRIMS
    | typeof ALGORITHM_TRUE_PRIMS
    | typeof ALGORITHM_ELLERS;
  indicator?: IndicatorConfig;
}

export type GenerateOptions = BuildMazeConfig & {
  rowCount: number;
  columnCount: number;
  cellWidth: number;
  solve?: boolean;

  // internal options
  watermarked?: boolean;
} & GridConfig;

export const BuildMazeConfigSchema = Joi.object<GenerateOptions>({
  rowCount: Joi.number().min(10).default(20).max(100).optional(),
  columnCount: Joi.number().min(10).default(20).max(100).optional(),
  cellWidth: Joi.number().min(10).default(20).max(30).optional(),

  cellShape: Joi.string()
    .valid(SHAPE_SQUARE, SHAPE_CIRCLE, SHAPE_HEXAGON, SHAPE_TRIANGLE)
    .default(SHAPE_SQUARE)
    .optional(),
  layers: Joi.number().min(2).max(30).default(5).optional(),
  openColor: Joi.string().default('white').optional(),
  closedColor: Joi.string().default('black').optional(),
  pathColor: Joi.string().default('red').optional(),

  exitConfig: Joi.string()
    .valid(EXITS_HARDEST, EXITS_HORIZONTAL, EXITS_VERTICAL)
    .default(EXITS_VERTICAL)
    .optional(),
  lineWidth: Joi.number().min(0.2).max(10).default(1).optional(),
  mask: Joi.array().items(Joi.array().items(Joi.number())).optional(),
  algorithm: Joi.string()
    .valid(
      ALGORITHM_BINARY_TREE,
      ALGORITHM_ALDOUS_BRODER,
      ALGORITHM_SIDEWINDER,
      ALGORITHM_WILSON,
      ALGORITHM_HUNT_AND_KILL,
      ALGORITHM_RECURSIVE_BACKTRACK,
      ALGORITHM_KRUSKAL,
      ALGORITHM_SIMPLIFIED_PRIMS,
      ALGORITHM_TRUE_PRIMS,
      ALGORITHM_ELLERS,
    )
    .default(ALGORITHM_RECURSIVE_BACKTRACK),
  solve: Joi.boolean().default(false).optional(),
  randomSeed: Joi.number().optional(),
  indicator: Joi.object<IndicatorConfig>({
    padding: Joi.number().min(0.09).max(0.9).default(0.35),
    start: Joi.object({
      color: Joi.string().default('green'),
      shape: Joi.string()
        .valid(SHAPE_SQUARE, SHAPE_CIRCLE, SHAPE_HEXAGON)
        .default(SHAPE_SQUARE),
    }),
    end: Joi.object({
      color: Joi.string().default('red'),
      shape: Joi.string()
        .valid(SHAPE_SQUARE, SHAPE_CIRCLE, SHAPE_HEXAGON)
        .default(SHAPE_SQUARE),
    }),
  }).allow(null),
});

export type DownloadOptions = GenerateOptions & {
  format: 'svg' | 'png' | 'pdf';
  pdf: {
    size?: 'A4' | 'letter';
    heading?: string | string[];
    fontSize?: number;
    fontColor?: string;
    fontFamily?: string;
    margin?: number;
  };
};

export const DownloadOptionsSchema =
  BuildMazeConfigSchema.append<DownloadOptions>({
    format: Joi.string().valid('svg', 'png', 'pdf').required(),
    pdf: Joi.object({
      size: Joi.string().valid('A4', 'letter').default('A4').optional(),
      heading: Joi.alternatives(Joi.string(), Joi.array().items(Joi.string())),
      fontSize: Joi.number().min(10).max(30).default(20).optional(),
      fontColor: Joi.string().default('#000000').optional(),
      fontFamily: Joi.string().default('Arial').optional(),
      margin: Joi.number().min(1).max(255).default(72).optional(),
    })
      .allow(null)
      .optional(),
  });

function solveMaze(maze) {
  function findStartAndEndCells() {
    let startCell, endCell;
    maze.forEachCell((cell) => {
      if (cell.metadata[METADATA_START_CELL]) {
        startCell = cell;
      }
      if (cell.metadata[METADATA_END_CELL]) {
        endCell = cell;
      }
    });
    return [startCell, endCell];
  }

  const [startCell, endCell] = findStartAndEndCells();
  maze.findPathBetween(startCell.coords, endCell.coords);
}

export async function generateMaze({
  columnCount,
  rowCount,
  cellWidth,
  drawType,
  solve,
  watermarked,
  ...rest
}: GenerateOptions) {
  let element: any;
  let width = columnCount * cellWidth;
  let height = rowCount * cellWidth;

  if (rest.cellShape === 'triangle') {
    width = ((columnCount + 1) / 2) * cellWidth;
    height *= TRIANGLE_HEIGHT;
  } else if (rest.cellShape === 'hexagon') {
    const takeFullWidthItems = (columnCount + 1) / 2;
    const takeHalfWidthItems = columnCount - takeFullWidthItems;
    width =
      takeFullWidthItems * cellWidth + takeHalfWidthItems * cellWidth * 0.75;

    const takeFullHeightItems = (rowCount + 1) / 2;
    const takeHalfHeightItems = rowCount - takeFullHeightItems;
    height =
      takeFullHeightItems * cellWidth + takeHalfHeightItems * cellWidth * 0.5;
  }

  if (drawType === 'canvas') {
    element = createCanvas(width, height);
  } else {
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    const dom = new JSDOM(
      `<!DOCTYPE html><svg width="${width}" height="${height}" xmlns="${SVG_NAMESPACE}" viewBox="0 0 ${width} ${height}"></svg>`,
    );
    element = dom.window.document.querySelector('svg');
  }

  const maze = buildMaze({
    ...rest,
    drawType,
    grid: {
      width: columnCount,
      height: rowCount,
      cellShape: rest.cellShape,
      layers: rest.layers,
      openColor: rest.openColor!,
      closedColor: rest.closedColor!,
      pathColor: rest.pathColor,
    },
    element,
  });

  const runAlgorithm = maze.runAlgorithm;
  runAlgorithm.toCompletion();

  if (solve) {
    solveMaze(maze);
  }

  maze.render();

  if (drawType === 'canvas') {
    if (watermarked) {
      return await addWatermark(element, 'Sample Maze', {
        fontSize: 60,
        rotation: 15,
      });
    }
    return element;
  }

  element.setAttribute('viewBox', `0 0 ${width} ${height}`);
  element.setAttribute('width', '');
  element.setAttribute('height', '');
  return element.outerHTML.trim();
}
