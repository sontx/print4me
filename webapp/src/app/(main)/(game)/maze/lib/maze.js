import { buildEventTarget } from "./utils.js";
import {
  METADATA_MASKED,
  METADATA_START_CELL,
  METADATA_RAW_COORDS,
  EVENT_CLICK,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_EAST,
  DIRECTION_WEST,
  DIRECTION_NORTH_WEST,
  DIRECTION_NORTH_EAST,
  DIRECTION_SOUTH_WEST,
  DIRECTION_SOUTH_EAST,
  DIRECTION_CLOCKWISE,
  DIRECTION_ANTICLOCKWISE,
  DIRECTION_INWARDS,
  DIRECTION_OUTWARDS,
  CELL_MASKED_COLOUR,
} from "./constants.js";

function getCellBackgroundColour(cell, grid) {
  if (cell.metadata[METADATA_MASKED]) {
    return CELL_MASKED_COLOUR;
  } else {
    return grid.metadata.openColor;
  }
}

const eventTarget = buildEventTarget("maze");

function buildBaseGrid(config) {
  "use strict";
  const cells = {},
    { random } = config;

  function makeIdFromCoords(coords) {
    return coords.join(",");
  }
  function buildCell(...coords) {
    const id = makeIdFromCoords(coords);
    const cell = {
      //TODO move methods outside so we only have 1 copy of each function
      id,
      coords,
      metadata: {},
      neighbours: {
        random(fnCriteria = () => true) {
          return random.choice(this.toArray().filter(fnCriteria));
        },
        toArray(fnCriteria = () => true) {
          return Object.values(this)
            .filter((value) => typeof value !== "function")
            .filter(fnCriteria);
        },
        linkedDirections() {
          return this.toArray()
            .filter((neighbour) => neighbour.isLinkedTo(cell))
            .map((linkedNeighbour) =>
              Object.keys(this).find(
                (direction) => this[direction] === linkedNeighbour
              )
            );
        },
      },
      isLinkedTo(otherCell) {
        return this.links.includes(otherCell);
      },
      links: [],
    };
    return cell;
  }
  function removeNeighbour(cell, neighbour) {
    const linkIndex = cell.links.indexOf(neighbour);
    if (linkIndex >= 0) {
      cell.links.splice(linkIndex, 1);
    }
    Object.keys(cell.neighbours)
      .filter((key) => cell.neighbours[key] === neighbour)
      .forEach((key) => delete cell.neighbours[key]);
  }
  function removeNeighbours(cell) {
    cell.neighbours.toArray().forEach((neighbour) => {
      removeNeighbour(cell, neighbour);
      removeNeighbour(neighbour, cell);
    });
  }

  return {
    forEachCell(fn) {
      Object.values(cells).forEach(fn);
    },
    getAllCellCoords() {
      const allCoords = [];
      this.forEachCell((cell) => allCoords.push(cell.coords));
      return allCoords;
    },
    link(cell1, cell2) {
      console.assert(cell1 !== cell2);
      console.assert(Object.values(cell1.neighbours).includes(cell2));
      console.assert(!cell1.links.includes(cell2));
      console.assert(Object.values(cell2.neighbours).includes(cell1));
      console.assert(!cell2.links.includes(cell1));

      cell1.links.push(cell2);
      cell2.links.push(cell1);
    },
    metadata: config,
    randomCell(fnCriteria = () => true) {
      return random.choice(Object.values(cells).filter(fnCriteria));
    },
    addCell(...coords) {
      const cell = buildCell(...coords),
        id = cell.id;
      console.assert(!cells[id]);
      cells[id] = cell;
      return id;
    },
    removeCell(...coords) {
      const cell = this.getCellByCoordinates(coords);
      removeNeighbours(cell);
      delete cells[cell.id];
    },
    makeNeighbours(cell1WithDirection, cell2WithDirection) {
      const cell1 = cell1WithDirection.cell,
        cell1Direction = cell1WithDirection.direction,
        cell2 = cell2WithDirection.cell,
        cell2Direction = cell2WithDirection.direction;

      console.assert(cell1 !== cell2);
      console.assert(cell1Direction !== cell2Direction);
      console.assert(!cell1.neighbours[cell2Direction]);
      console.assert(!cell2.neighbours[cell1Direction]);
      cell1.neighbours[cell2Direction] = cell2;
      cell2.neighbours[cell1Direction] = cell1;
    },
    getCellByCoordinates(...coords) {
      const id = makeIdFromCoords(coords);
      return cells[id];
    },
    get cellCount() {
      return Object.values(cells).length;
    },
    on(eventName, handler) {
      eventTarget.on(eventName, handler);
    },

    clearMetadata(...keys) {
      keys.forEach((key) => {
        delete this.metadata[key];
        this.forEachCell((cell) => delete cell.metadata[key]);
      });
    },
    dispose() {
      eventTarget.off();
      if (config.drawingSurface) {
        config.drawingSurface.dispose();
      }
    },
  };
}

export function buildSquareGrid(config) {
  "use strict";
  const { drawingSurface: defaultDrawingSurface } = config,
    grid = buildBaseGrid(config);

  defaultDrawingSurface.on(EVENT_CLICK, (event) => {
    const coords = [Math.floor(event.x), Math.floor(event.y)];
    if (grid.getCellByCoordinates(coords)) {
      eventTarget.trigger(EVENT_CLICK, {
        coords,
        rawCoords: [event.rawX, event.rawY],
        shift: event.shift,
        alt: event.alt,
      });
    }
  });

  grid.isSquare = true;
  grid.initialise = function () {
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        grid.addCell(x, y);
      }
    }
  };

  grid.render = function (drawingSurface = defaultDrawingSurface) {
    function drawFilledSquare(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, cell) {
      drawingSurface.setColour(getCellBackgroundColour(cell, grid));
      drawingSurface.fillPolygon(
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
        { x: p3x, y: p3y },
        { x: p4x, y: p4y }
      );
      drawingSurface.setColour(config.closedColor);
    }

    drawingSurface.setSpaceRequirements(
      grid.metadata.width,
      grid.metadata.height,
      config.lineWidth,
    );
    drawingSurface.clear();
    grid.forEachCell((cell) => {
      const [x, y] = cell.coords;
      drawFilledSquare(x, y, x + 1, y, x + 1, y + 1, x, y + 1, cell);
    });

    grid.forEachCell((cell) => {
      const [x, y] = cell.coords,
        northNeighbour = cell.neighbours[DIRECTION_NORTH],
        southNeighbour = cell.neighbours[DIRECTION_SOUTH],
        eastNeighbour = cell.neighbours[DIRECTION_EAST],
        westNeighbour = cell.neighbours[DIRECTION_WEST];

      if (!northNeighbour || !cell.isLinkedTo(northNeighbour)) {
        drawingSurface.line(x, y, x + 1, y);
      }
      if (!southNeighbour || !cell.isLinkedTo(southNeighbour)) {
        drawingSurface.line(x, y + 1, x + 1, y + 1);
      }
      if (!eastNeighbour || !cell.isLinkedTo(eastNeighbour)) {
        drawingSurface.line(x + 1, y, x + 1, y + 1);
      }
      if (!westNeighbour || !cell.isLinkedTo(westNeighbour)) {
        drawingSurface.line(x, y, x, y + 1);
      }
      cell.metadata[METADATA_RAW_COORDS] = drawingSurface.convertCoords(
        x + 0.5,
        y + 0.5
      );
    });
  };

  grid.getClosestDirectionForClick = function (cell, clickEvent) {
    const [cellX, cellY] = cell.metadata[METADATA_RAW_COORDS],
      [clickX, clickY] = clickEvent.rawCoords,
      xDiff = clickX - cellX,
      yDiff = clickY - cellY;

    if (Math.abs(xDiff) < Math.abs(yDiff)) {
      return yDiff > 0 ? DIRECTION_SOUTH : DIRECTION_NORTH;
    } else {
      return xDiff > 0 ? DIRECTION_EAST : DIRECTION_WEST;
    }
  };

  return grid;
}

function midPoint(...values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function buildTriangularGrid(config) {
  "use strict";
  const { drawingSurface: defaultDrawingSurface } = config,
    grid = buildBaseGrid(config),
    verticalAltitude = Math.sin(Math.PI / 3);

  defaultDrawingSurface.on(EVENT_CLICK, (event) => {
    function getXCoord(event) {
      const xDivision = 2 * event.x,
        y = getYCoord(event);

      if ((Math.floor(xDivision) + y) % 2) {
        const tx = 1 - (xDivision % 1),
          ty = (event.y / verticalAltitude) % 1;
        if (tx > ty) {
          return Math.floor(xDivision) - 1;
        } else {
          return Math.floor(xDivision);
        }
      } else {
        const tx = xDivision % 1,
          ty = (event.y / verticalAltitude) % 1;
        if (tx > ty) {
          return Math.floor(xDivision);
        } else {
          return Math.floor(xDivision) - 1;
        }
      }
    }
    function getYCoord(event) {
      return Math.floor(event.y / verticalAltitude);
    }
    const x = getXCoord(event),
      y = getYCoord(event),
      coords = [x, y];

    if (grid.getCellByCoordinates(coords)) {
      eventTarget.trigger(EVENT_CLICK, {
        coords,
        rawCoords: [event.rawX, event.rawY],
        shift: event.shift,
        alt: event.alt,
      });
    }
  });

  function hasBaseOnSouthSide(x, y) {
    return (x + y) % 2;
  }
  grid.isSquare = false;
  grid.initialise = function () {
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        grid.addCell(x, y);
      }
    }
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        const cell = grid.getCellByCoordinates(x, y),
          eastNeighbour = grid.getCellByCoordinates(x + 1, y),
          southNeighbour =
            hasBaseOnSouthSide(x, y) && grid.getCellByCoordinates(x, y + 1);
        if (eastNeighbour) {
          grid.makeNeighbours(
            { cell, direction: DIRECTION_WEST },
            { cell: eastNeighbour, direction: DIRECTION_EAST }
          );
        }
        if (southNeighbour) {
          grid.makeNeighbours(
            { cell, direction: DIRECTION_NORTH },
            { cell: southNeighbour, direction: DIRECTION_SOUTH }
          );
        }
      }
    }
  };

  grid.render = function (drawingSurface = defaultDrawingSurface) {
    drawingSurface.setSpaceRequirements(
      0.5 + grid.metadata.width / 2,
      grid.metadata.height * verticalAltitude,
      config.lineWidth,
    );

    function drawFilledTriangle(p1x, p1y, p2x, p2y, p3x, p3y, cell) {
      drawingSurface.setColour(getCellBackgroundColour(cell, grid));
      drawingSurface.fillPolygon(
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
        { x: p3x, y: p3y }
      );
      drawingSurface.setColour(config.closedColor);
    }

    function getCornerCoords(x, y) {
      let p1x, p1y, p2x, p2y, p3x, p3y;

      if (hasBaseOnSouthSide(x, y)) {
        p1x = x / 2;
        p1y = (y + 1) * verticalAltitude;
        p2x = (x + 1) / 2;
        p2y = p1y - verticalAltitude;
        p3x = p1x + 1;
        p3y = p1y;
      } else {
        p1x = x / 2;
        p1y = y * verticalAltitude;
        p2x = (x + 1) / 2;
        p2y = p1y + verticalAltitude;
        p3x = p1x + 1;
        p3y = p1y;
      }
      return [p1x, p1y, p2x, p2y, p3x, p3y];
    }

    drawingSurface.clear();

    grid.forEachCell((cell) => {
      "use strict";
      const [x, y] = cell.coords,
        [p1x, p1y, p2x, p2y, p3x, p3y] = getCornerCoords(x, y);
      drawFilledTriangle(p1x, p1y, p2x, p2y, p3x, p3y, cell);
    });

    grid.forEachCell((cell) => {
      "use strict";
      const [x, y] = cell.coords,
        northNeighbour = cell.neighbours[DIRECTION_NORTH],
        southNeighbour = cell.neighbours[DIRECTION_SOUTH],
        eastNeighbour = cell.neighbours[DIRECTION_EAST],
        westNeighbour = cell.neighbours[DIRECTION_WEST];

      const [p1x, p1y, p2x, p2y, p3x, p3y] = getCornerCoords(x, y),
        northOrSouthNeighbour = hasBaseOnSouthSide(x, y)
          ? southNeighbour
          : northNeighbour;

      if (!northOrSouthNeighbour || !cell.isLinkedTo(northOrSouthNeighbour)) {
        drawingSurface.line(p1x, p1y, p3x, p3y);
      }
      if (!eastNeighbour || !cell.isLinkedTo(eastNeighbour)) {
        drawingSurface.line(p2x, p2y, p3x, p3y);
      }
      if (!westNeighbour || !cell.isLinkedTo(westNeighbour)) {
        drawingSurface.line(p1x, p1y, p2x, p2y);
      }
      cell.metadata[METADATA_RAW_COORDS] = drawingSurface.convertCoords(
        midPoint(p1x, p2x, p3x),
        midPoint(p1y, p2y, p3y)
      );
    });
  };

  grid.getClosestDirectionForClick = function (cell, clickEvent) {
    const cellCoords = cell.metadata[METADATA_RAW_COORDS],
      clickCoords = clickEvent.rawCoords,
      baseOnSouthSide = hasBaseOnSouthSide(...cell.coords);

    let angleFromNorth = getAngleFromNorth(cellCoords, clickCoords),
      sixtyDegrees = (Math.PI * 2) / 6;

    if (baseOnSouthSide) {
      if (Math.abs(angleFromNorth) > 2 * sixtyDegrees) {
        return DIRECTION_SOUTH;
      } else if (angleFromNorth > 0) {
        return DIRECTION_EAST;
      } else {
        return DIRECTION_WEST;
      }
    } else {
      if (Math.abs(angleFromNorth) < sixtyDegrees) {
        return DIRECTION_NORTH;
      } else if (angleFromNorth > 0) {
        return DIRECTION_EAST;
      } else {
        return DIRECTION_WEST;
      }
    }
  };

  return grid;
}

function getAngleFromNorth(origin, point) {
  const [ox, oy] = origin,
    [px, py] = point,
    angle = Math.atan2(oy - py, px - ox),
    transformedAngle = Math.PI / 2 - angle;
  if (transformedAngle <= Math.PI) {
    return transformedAngle;
  }
  return -(Math.PI * 2 - transformedAngle);
}

export function buildHexagonalGrid(config) {
  "use strict";
  const { drawingSurface: defaultDrawingSurface } = config,
    grid = buildBaseGrid(config);

  const yOffset1 = Math.cos(Math.PI / 3),
    yOffset2 = 2 - yOffset1,
    yOffset3 = 2,
    xOffset = Math.sin(Math.PI / 3);

  defaultDrawingSurface.on(EVENT_CLICK, (event) => {
    const ty = (event.y / (2 - yOffset1)) % 1;
    let x, y;
    const row = Math.floor(event.y / (2 - yOffset1)),
      xRowBasedAdjustment = (row % 2) * xOffset;

    if (ty <= yOffset1) {
      // in zig-zag region
      const tx = Math.abs(
          xOffset - ((event.x - xRowBasedAdjustment) % (2 * xOffset))
        ),
        tty = ty * (2 - yOffset1),
        isAboveLine = tx / tty > Math.tan(Math.PI / 3);
      let xYBasedAdjustment, yAdjustment;
      if (isAboveLine) {
        if (xRowBasedAdjustment) {
          xYBasedAdjustment =
            (event.x - xRowBasedAdjustment) % (2 * xOffset) > xOffset ? 1 : 0;
        } else {
          xYBasedAdjustment = event.x % (2 * xOffset) > xOffset ? 0 : -1;
        }
        yAdjustment = -1;
      } else {
        xYBasedAdjustment = 0;
        yAdjustment = 0;
      }
      x =
        Math.floor((event.x - xRowBasedAdjustment) / (2 * xOffset)) +
        xYBasedAdjustment;
      y = row + yAdjustment;
    } else {
      // in rectangular region
      x = Math.floor((event.x - xRowBasedAdjustment) / (2 * xOffset));
      y = row;
    }
    const coords = [x, y];

    if (grid.getCellByCoordinates(coords)) {
      eventTarget.trigger(EVENT_CLICK, {
        coords,
        rawCoords: [event.rawX, event.rawY],
        shift: event.shift,
        alt: event.alt,
      });
    }
  });

  grid.isSquare = false;
  grid.initialise = function () {
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        grid.addCell(x, y);
      }
    }
    for (let x = 0; x < config.width; x++) {
      for (let y = 0; y < config.height; y++) {
        const cell = grid.getCellByCoordinates(x, y),
          rowBasedXOffset = (y + 1) % 2,
          eastNeighbour = grid.getCellByCoordinates(x + 1, y),
          southWestNeighbour = grid.getCellByCoordinates(
            x - rowBasedXOffset,
            y + 1
          ),
          southEastNeighbour = grid.getCellByCoordinates(
            x + 1 - rowBasedXOffset,
            y + 1
          );

        if (eastNeighbour) {
          grid.makeNeighbours(
            { cell, direction: DIRECTION_WEST },
            { cell: eastNeighbour, direction: DIRECTION_EAST }
          );
        }
        if (southWestNeighbour) {
          grid.makeNeighbours(
            { cell, direction: DIRECTION_NORTH_EAST },
            { cell: southWestNeighbour, direction: DIRECTION_SOUTH_WEST }
          );
        }
        if (southEastNeighbour) {
          grid.makeNeighbours(
            { cell, direction: DIRECTION_NORTH_WEST },
            { cell: southEastNeighbour, direction: DIRECTION_SOUTH_EAST }
          );
        }
      }
    }
  };

  grid.render = function (drawingSurface = defaultDrawingSurface) {
    drawingSurface.setSpaceRequirements(
      grid.metadata.width * 2 * xOffset +
        Math.min(1, grid.metadata.height - 1) * xOffset,
      grid.metadata.height * yOffset2 + yOffset1,
      config.lineWidth,
    );

    function drawFilledHexagon(
      p1x,
      p1y,
      p2x,
      p2y,
      p3x,
      p3y,
      p4x,
      p4y,
      p5x,
      p5y,
      p6x,
      p6y,
      cell
    ) {
      drawingSurface.setColour(getCellBackgroundColour(cell, grid));
      drawingSurface.fillPolygon(
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
        { x: p3x, y: p3y },
        { x: p4x, y: p4y },
        { x: p5x, y: p5y },
        { x: p6x, y: p6y }
      );
      drawingSurface.setColour(config.closedColor);
    }
    function getCornerCoords(x, y) {
      const rowXOffset = Math.abs(y % 2) * xOffset,
        p1x = rowXOffset + x * xOffset * 2,
        p1y = yOffset1 + y * yOffset2,
        p2x = p1x,
        p2y = (y + 1) * yOffset2,
        p3x = rowXOffset + (2 * x + 1) * xOffset,
        p3y = y * yOffset2 + yOffset3,
        p4x = p2x + 2 * xOffset,
        p4y = p2y,
        p5x = p4x,
        p5y = p1y,
        p6x = p3x,
        p6y = y * yOffset2;

      return [p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y];
    }

    drawingSurface.clear();
    grid.forEachCell((cell) => {
      "use strict";
      const [x, y] = cell.coords,
        [p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y] =
          getCornerCoords(x, y);

      drawFilledHexagon(
        p1x,
        p1y,
        p2x,
        p2y,
        p3x,
        p3y,
        p4x,
        p4y,
        p5x,
        p5y,
        p6x,
        p6y,
        cell
      );
    });

    grid.forEachCell((cell) => {
      "use strict";
      const [x, y] = cell.coords,
        eastNeighbour = cell.neighbours[DIRECTION_EAST],
        westNeighbour = cell.neighbours[DIRECTION_WEST],
        northEastNeighbour = cell.neighbours[DIRECTION_NORTH_EAST],
        northWestNeighbour = cell.neighbours[DIRECTION_NORTH_WEST],
        southEastNeighbour = cell.neighbours[DIRECTION_SOUTH_EAST],
        southWestNeighbour = cell.neighbours[DIRECTION_SOUTH_WEST],
        [p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y, p5x, p5y, p6x, p6y] =
          getCornerCoords(x, y);

      if (!eastNeighbour || !cell.isLinkedTo(eastNeighbour)) {
        drawingSurface.line(p4x, p4y, p5x, p5y);
      }
      if (!westNeighbour || !cell.isLinkedTo(westNeighbour)) {
        drawingSurface.line(p1x, p1y, p2x, p2y);
      }
      if (!northEastNeighbour || !cell.isLinkedTo(northEastNeighbour)) {
        drawingSurface.line(p5x, p5y, p6x, p6y);
      }
      if (!northWestNeighbour || !cell.isLinkedTo(northWestNeighbour)) {
        drawingSurface.line(p1x, p1y, p6x, p6y);
      }
      if (!southEastNeighbour || !cell.isLinkedTo(southEastNeighbour)) {
        drawingSurface.line(p3x, p3y, p4x, p4y);
      }
      if (!southWestNeighbour || !cell.isLinkedTo(southWestNeighbour)) {
        drawingSurface.line(p2x, p2y, p3x, p3y);
      }
      cell.metadata[METADATA_RAW_COORDS] = drawingSurface.convertCoords(
        midPoint(p1x, p2x, p3x, p4x, p5x, p6x),
        midPoint(p1y, p2y, p3y, p4y, p5y, p6y)
      );
    });
  };

  grid.getClosestDirectionForClick = function (cell, clickEvent) {
    const cellCoords = cell.metadata[METADATA_RAW_COORDS],
      clickCoords = clickEvent.rawCoords;

    let angleFromNorth = getAngleFromNorth(cellCoords, clickCoords),
      sixtyDegrees = (Math.PI * 2) / 6,
      sector = Math.floor((angleFromNorth + Math.PI) / sixtyDegrees);

    return [
      DIRECTION_SOUTH_WEST,
      DIRECTION_WEST,
      DIRECTION_NORTH_WEST,
      DIRECTION_NORTH_EAST,
      DIRECTION_EAST,
      DIRECTION_SOUTH_EAST,
    ][sector];
  };

  return grid;
}

export function buildCircularGrid(config) {
  "use strict";
  const grid = buildBaseGrid(config),
    cellCounts = cellCountsForLayers(config.layers),
    { drawingSurface: defaultDrawingSurface } = config;

  const cx = grid.metadata.layers,
    cy = grid.metadata.layers;

  defaultDrawingSurface.on(EVENT_CLICK, (event) => {
    const xDistance = event.x - cx,
      yDistance = event.y - cy,
      distanceFromCenter = Math.sqrt(
        Math.pow(xDistance, 2) + Math.pow(yDistance, 2)
      ),
      layer = Math.floor(distanceFromCenter),
      cellsInThisLayer = cellCounts[layer],
      anglePerCell = (Math.PI * 2) / cellsInThisLayer,
      angle =
        (Math.atan2(yDistance, xDistance) + 2.5 * Math.PI) % (Math.PI * 2),
      cell = Math.floor(angle / anglePerCell),
      coords = [layer, cell];

    if (grid.getCellByCoordinates(coords)) {
      eventTarget.trigger(EVENT_CLICK, {
        coords,
        rawCoords: [event.rawX, event.rawY],
        shift: event.shift,
        alt: event.alt,
      });
    }
  });
  function cellCountsForLayers(layers) {
    const counts = [1],
      rowRadius = 1 / layers;
    while (counts.length < layers) {
      const layer = counts.length,
        previousCount = counts[layer - 1],
        circumference = (Math.PI * 2 * layer * rowRadius) / previousCount;
      counts.push(previousCount * Math.round(circumference / rowRadius));
    }
    return counts;
  }

  grid.isSquare = false;
  grid.initialise = function () {
    for (let l = 0; l < config.layers; l++) {
      const cellsInLayer = cellCounts[l];
      for (let c = 0; c < cellsInLayer; c++) {
        grid.addCell(l, c);
      }
    }

    for (let l = 0; l < config.layers; l++) {
      const cellsInLayer = cellCounts[l];
      for (let c = 0; c < cellsInLayer; c++) {
        const cell = grid.getCellByCoordinates(l, c);
        if (cellsInLayer > 1) {
          const clockwiseNeighbour = grid.getCellByCoordinates(
              l,
              (c + 1) % cellsInLayer
            ),
            anticlockwiseNeighbour = grid.getCellByCoordinates(
              l,
              (c + cellsInLayer - 1) % cellsInLayer
            );
          grid.makeNeighbours(
            { cell, direction: DIRECTION_CLOCKWISE },
            { cell: anticlockwiseNeighbour, direction: DIRECTION_ANTICLOCKWISE }
          );
        }

        if (l < config.layers - 1) {
          const cellsInNextLayer = cellCounts[l + 1],
            outerNeighbourCount = cellsInNextLayer / cellsInLayer;
          for (let o = 0; o < outerNeighbourCount; o++) {
            const outerNeighbour = grid.getCellByCoordinates(
              l + 1,
              c * outerNeighbourCount + o
            );
            grid.makeNeighbours(
              { cell, direction: DIRECTION_INWARDS },
              { cell: outerNeighbour, direction: `${DIRECTION_OUTWARDS}_${o}` }
            );
          }
        }
      }
    }
  };

  function getCellCoords(l, c) {
    const cellsInLayer = cellCounts[l],
      anglePerCell = (Math.PI * 2) / cellsInLayer,
      startAngle = anglePerCell * c,
      endAngle = startAngle + anglePerCell,
      innerDistance = l,
      outerDistance = l + 1;

    return [startAngle, endAngle, innerDistance, outerDistance];
  }

  grid.render = function (drawingSurface = defaultDrawingSurface) {
    drawingSurface.setSpaceRequirements(
      grid.metadata.layers * 2,
      grid.metadata.layers * 2,
      config.lineWidth,
    );

    function polarToXy(angle, distance) {
      return [cx + distance * Math.sin(angle), cy - distance * Math.cos(angle)];
    }
    function drawFilledSegment(smallR, bigR, startAngle, endAngle, cell) {
      drawingSurface.setColour(getCellBackgroundColour(cell, grid));
      drawingSurface.fillSegment(cx, cy, smallR, bigR, startAngle, endAngle);
      drawingSurface.setColour(config.closedColor);
    }

    drawingSurface.clear();
    grid.forEachCell((cell) => {
      "use strict";
      const [l, c] = cell.coords,
        [startAngle, endAngle, innerDistance, outerDistance] = getCellCoords(
          l,
          c
        );

      drawFilledSegment(l, l + 1, startAngle, endAngle, cell);
    });

    grid.forEachCell((cell) => {
      "use strict";
      const [l, c] = cell.coords,
        [startAngle, endAngle, innerDistance, outerDistance] = getCellCoords(
          l,
          c
        ),
        clockwiseNeighbour = cell.neighbours[DIRECTION_CLOCKWISE],
        anticlockwiseNeighbour = cell.neighbours[DIRECTION_ANTICLOCKWISE],
        inwardsNeighbour = cell.neighbours[DIRECTION_INWARDS],
        anticlockwiseOutsideNeighbour =
          cell.neighbours[`${DIRECTION_OUTWARDS}_0`],
        clockwiseOutsideNeighbour = cell.neighbours[`${DIRECTION_OUTWARDS}_1`],
        isOutermostLayer = l === grid.metadata.layers - 1,
        isStartCell = cell.metadata[METADATA_START_CELL];

      if (l > 0) {
        if (!cell.isLinkedTo(anticlockwiseNeighbour)) {
          drawingSurface.line(
            ...polarToXy(startAngle, innerDistance),
            ...polarToXy(startAngle, outerDistance)
          );
        }
        if (!cell.isLinkedTo(clockwiseNeighbour)) {
          drawingSurface.line(
            ...polarToXy(endAngle, innerDistance),
            ...polarToXy(endAngle, outerDistance)
          );
        }
        if (!cell.isLinkedTo(inwardsNeighbour)) {
          drawingSurface.arc(cx, cy, innerDistance, startAngle, endAngle);
        }
        const nextLaterOutHasSameNumberOfCells =
          cellCounts[l] === cellCounts[l + 1];
        if (
          (isOutermostLayer ||
            (nextLaterOutHasSameNumberOfCells &&
              !cell.isLinkedTo(anticlockwiseOutsideNeighbour))) &&
          !isStartCell
        ) {
          drawingSurface.arc(cx, cy, outerDistance, startAngle, endAngle);
        } else if (!nextLaterOutHasSameNumberOfCells) {
          const halfwayAngle = (endAngle + startAngle) / 2;
          if (!cell.isLinkedTo(anticlockwiseOutsideNeighbour) && !isStartCell) {
            drawingSurface.arc(cx, cy, outerDistance, startAngle, halfwayAngle);
          }
          if (!cell.isLinkedTo(clockwiseOutsideNeighbour) && !isStartCell) {
            drawingSurface.arc(cx, cy, outerDistance, halfwayAngle, endAngle);
          }
        }
        cell.metadata[METADATA_RAW_COORDS] = drawingSurface.convertCoords(
          ...polarToXy(
            midPoint(startAngle, endAngle),
            midPoint(innerDistance, outerDistance)
          )
        );
      } else {
        cell.metadata[METADATA_RAW_COORDS] = drawingSurface.convertCoords(
          cx,
          cy
        );
      }
    });
  };

  grid.getClosestDirectionForClick = function (cell, clickEvent) {
    const cellCoords = cell.metadata[METADATA_RAW_COORDS],
      clickCoords = clickEvent.rawCoords,
      [startAngle, endAngle, _1, _2] = getCellCoords(...cell.coords),
      coordAngle = midPoint(startAngle, endAngle);

    let angleFromNorth = getAngleFromNorth(cellCoords, clickCoords), // -180 to 180
      angleFromLineToCenter =
        (Math.PI * 4 + angleFromNorth - coordAngle) % (Math.PI * 2); //

    const fortyFiveDegrees = Math.PI / 4;
    if (angleFromLineToCenter <= fortyFiveDegrees) {
      return `${DIRECTION_OUTWARDS}_0`;
    } else if (
      angleFromLineToCenter > fortyFiveDegrees &&
      angleFromLineToCenter <= 3 * fortyFiveDegrees
    ) {
      return DIRECTION_CLOCKWISE;
    } else if (
      angleFromLineToCenter > 3 * fortyFiveDegrees &&
      angleFromLineToCenter <= 5 * fortyFiveDegrees
    ) {
      return DIRECTION_INWARDS;
    } else if (
      angleFromLineToCenter > 5 * fortyFiveDegrees &&
      angleFromLineToCenter <= 7 * fortyFiveDegrees
    ) {
      return DIRECTION_ANTICLOCKWISE;
    } else {
      return `${DIRECTION_OUTWARDS}_0`;
    }
  };

  return grid;
}
