import React, { useRef, useEffect, useMemo } from "react";
import { buildMaze } from "./lib/main.js";
import { buildStateMachine } from "./stateMachine.js";
import {
  METADATA_MASKED,
  ALGORITHM_NONE,
  EXITS_NONE,
} from "./lib/constants.js";

const TRIANGLE_HEIGHT = Math.sqrt(3) / 2;

const MazeMask = ({
  formData: {
    shape,
    columnCount,
    rowCount,
    cellWidth,
    mask,
    layers,
    lineWidth,
    mazeColor,
    mazeBackgroundColor,
  },
  setMaskData,
  maskData,
}: any) => {
  const canvasRef = useRef(null);
  const stateMachine = useMemo(() => buildStateMachine(), []);
  const intColumnCount = parseInt(columnCount);
  const intRowCount = parseInt(rowCount);
  let width = intColumnCount * cellWidth;
  let height = intRowCount * cellWidth;

  if (shape === "Triangle") {
    width = ((intColumnCount + 1) / 2) * cellWidth;
    height *= TRIANGLE_HEIGHT;
  } else if (shape === "Hexagon") {
    const takeFullWidthItems = (intColumnCount + 1) / 2;
    const takeHalfWidthItems = intColumnCount - takeFullWidthItems;
    width =
      takeFullWidthItems * cellWidth + takeHalfWidthItems * cellWidth * 0.75;

    const takeFullHeightItems = (intRowCount + 1) / 2;
    const takeHalfHeightItems = intRowCount - takeFullHeightItems;
    height =
      takeFullHeightItems * cellWidth + takeHalfHeightItems * cellWidth * 0.5;
  }

  useEffect(() => {
    if (canvasRef.current) {
      const maze = buildMaze({
        grid: {
          cellShape: shape.toLowerCase(),
          width: shape !== "Circle" ? parseInt(columnCount) : undefined,
          height: shape !== "Circle" ? parseInt(rowCount) : undefined,
          layers: parseInt(layers),
          openColor: mazeBackgroundColor,
          closedColor: mazeColor,
        },
        lineWidth,
        algorithm: ALGORITHM_NONE,
        element: canvasRef.current,
        mask: [],
        exitConfig: EXITS_NONE,
      });

      maze.on("click", (event: any) => {
        if (stateMachine.state === "Masking") {
          const cell = maze.getCellByCoordinates(event.coords);
          cell.metadata[METADATA_MASKED] = !cell.metadata[METADATA_MASKED];
          maze.render();

          const mask: any[] = [];
          maze.forEachCell((cell: any) => {
            if (cell.metadata[METADATA_MASKED]) {
              mask.push(cell.coords);
            }
          });
          setMaskData(mask);
        }
      });

      stateMachine.masking();
      maskData?.forEach((maskedCoords: any) => {
        const cell = maze.getCellByCoordinates(maskedCoords);
        if (cell) {
          cell.metadata[METADATA_MASKED] = true;
        }
      });
      maze.runAlgorithm.toCompletion();
      maze.render();

      return () => {
        maze.dispose();
      };
    }
  }, [
    shape,
    mask,
    stateMachine,
    columnCount,
    rowCount,
    cellWidth,
    layers,
    lineWidth,
    mazeColor,
    mazeBackgroundColor,
    maskData,
    setMaskData,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="my-0 mx-auto block max-w-[calc(100vw-60px)]"
    />
  );
};

export default MazeMask;
