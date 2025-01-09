import { Injectable } from '@nestjs/common';
import { addWatermark } from '../utils/file-utils';
import { GenerateOptions } from './maze-generator';
import { createCanvas } from 'canvas';
import { JSDOM } from 'jsdom';
import { buildMaze } from './lib/main';
import { METADATA_END_CELL, METADATA_START_CELL } from './lib/constants';

@Injectable()
export class MazeService {
  private solveMaze(maze) {
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

  async generateMaze({
    columnCount,
    rowCount,
    cellWidth,
    drawType,
    solve,
    watermarked,
    ...rest
  }: GenerateOptions) {
    let element: any;
    const width =
      (rest.cellShape === 'triangle' ? (columnCount + 1) / 2 : columnCount) *
      cellWidth;
    const height = rowCount * cellWidth;
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
      this.solveMaze(maze);
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
}
