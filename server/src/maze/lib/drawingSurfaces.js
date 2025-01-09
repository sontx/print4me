export const drawingSurfaces = {
  /**
   * Canvas-based drawing surface using node-canvas.
   * @param {Object} config
   *
   * Returns an object with methods to draw shapes onto an offscreen Canvas.
   * You can get the underlying node-canvas by calling .getCanvas().
   */
  canvas(config) {
    const { el, openColor } = config;

    // Create a Node canvas
    const canvas = el;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");

    // Internal state
    let magnification = 1;
    let xOffset = 0;
    let yOffset = 0;

    // Helper functions
    function xCoord(x) {
      return xOffset + x * magnification;
    }
    function invXCoord(x) {
      return (x - xOffset) / magnification;
    }
    function yCoord(y) {
      return yOffset + y * magnification;
    }
    function invYCoord(y) {
      return (y - yOffset) / magnification;
    }
    function distance(d) {
      return d * magnification;
    }

    return {
      /**
       * Access the node-canvas instance directly.
       * For example, to convert to a Buffer:
       *   drawingSurfaces.canvas(...).getCanvas().toBuffer()
       */
      getCanvas() {
        return canvas;
      },

      clear() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = openColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },

      setSpaceRequirements(
        requiredWidth,
        requiredHeight,
        shapeSpecificLineWidthAdjustment = 1,
      ) {
        const GLOBAL_LINE_WIDTH_ADJUSTMENT = 0.1;
        const verticalLineWidth =
          (height *
            GLOBAL_LINE_WIDTH_ADJUSTMENT *
            shapeSpecificLineWidthAdjustment) /
          requiredHeight;
        const horizontalLineWidth =
          (width *
            GLOBAL_LINE_WIDTH_ADJUSTMENT *
            shapeSpecificLineWidthAdjustment) /
          requiredWidth;
        const lineWidth = Math.min(verticalLineWidth, horizontalLineWidth);

        magnification = Math.min(
          (width - lineWidth) / requiredWidth,
          (height - lineWidth) / requiredHeight,
        );

        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";

        xOffset = lineWidth / 2;
        yOffset = lineWidth / 2;
      },

      setColour(colour) {
        ctx.strokeStyle = colour;
        ctx.fillStyle = colour;
      },

      line(x1, y1, x2, y2, existingPath = false) {
        if (!existingPath) {
          ctx.beginPath();
        }
        ctx.moveTo(xCoord(x1), yCoord(y1));
        ctx.lineTo(xCoord(x2), yCoord(y2));
        if (!existingPath) {
          ctx.stroke();
        }
      },

      arc(cx, cy, r, startAngle, endAngle, fill = false) {
        const counterclockwise = false,
          existingPath = false;

        if (!existingPath) {
          ctx.beginPath();
        }
        ctx.arc(
          xCoord(cx),
          yCoord(cy),
          distance(r),
          startAngle - Math.PI / 2,
          endAngle - Math.PI / 2,
          counterclockwise,
        );
        if (!existingPath) {
          if (fill) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
        }
      },

      fillPolygon(...xyPoints) {
        ctx.beginPath();
        xyPoints.forEach(({ x, y }, i) => {
          if (i === 0) {
            ctx.moveTo(xCoord(x), yCoord(y));
          } else {
            ctx.lineTo(xCoord(x), yCoord(y));
          }
        });
        ctx.closePath();
        ctx.fill();
      },

      fillSegment(cx, cy, smallR, bigR, startAngle, endAngle) {
        const innerStartX = cx + smallR * Math.sin(startAngle);
        const innerStartY = cy - smallR * Math.cos(startAngle);
        const innerEndX = cx + smallR * Math.sin(endAngle);
        const innerEndY = cy - smallR * Math.cos(endAngle);
        const outerStartX = cx + bigR * Math.sin(startAngle);
        const outerStartY = cy - bigR * Math.cos(startAngle);
        const outerEndX = cx + bigR * Math.sin(endAngle);
        const outerEndY = cy - bigR * Math.cos(endAngle);

        ctx.beginPath();
        this.line(innerStartX, innerStartY, outerStartX, outerStartY, true);
        this.arc(cx, cy, bigR, startAngle, endAngle, false, true);
        this.line(outerEndX, outerEndY, innerEndX, innerEndY, true);
        this.arc(cx, cy, smallR, endAngle, startAngle, true, true);
        ctx.closePath();
        ctx.fill();
      },

      convertCoords(x, y) {
        return [xCoord(x), yCoord(y)];
      },

      on(eventName, handler) {},
      dispose() {},
    };
  },

  /**
   * SVG-based drawing surface using jsdom.
   * @param {Object} config
   *
   * Returns an object with methods to draw into an SVG DOM.
   * You can get the serialized SVG string by calling .getSVG().
   */
  svg(config) {
    const { el, openColor } = config;
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const width = Number(el.getAttribute("width"));
    const height = Number(el.getAttribute("height"));

    // Internal state
    let magnification = 1;
    let colour = "black";
    let lineWidth = 1;
    let xOffset = 0;
    let yOffset = 0;

    // Helper functions
    function xCoord(x) {
      return xOffset + x * magnification;
    }
    function invXCoord(x) {
      return (x - xOffset) / magnification;
    }
    function yCoord(y) {
      return yOffset + y * magnification;
    }
    function invYCoord(y) {
      return (y - yOffset) / magnification;
    }
    function distance(d) {
      return d * magnification;
    }
    function polarToXy(cx, cy, d, angle) {
      return [
        xCoord(cx + d * Math.sin(angle)),
        yCoord(cy - d * Math.cos(angle)),
      ];
    }

    return {
      /**
       * Clear the SVG contents by removing all child nodes.
       */
      clear() {
        el.innerHTML = `<rect width="100%" height="100%" fill="${openColor}"/>`;
      },

      setSpaceRequirements(
        requiredWidth,
        requiredHeight,
        shapeSpecificLineWidthAdjustment = 1,
      ) {
        const GLOBAL_LINE_WIDTH_ADJUSTMENT = 0.1;
        const verticalLineWidth =
          (height *
            GLOBAL_LINE_WIDTH_ADJUSTMENT *
            shapeSpecificLineWidthAdjustment) /
          requiredHeight;
        const horizontalLineWidth =
          (width *
            GLOBAL_LINE_WIDTH_ADJUSTMENT *
            shapeSpecificLineWidthAdjustment) /
          requiredWidth;

        lineWidth = Math.min(verticalLineWidth, horizontalLineWidth);
        magnification = Math.min(
          (width - lineWidth) / requiredWidth,
          (height - lineWidth) / requiredHeight,
        );

        xOffset = lineWidth / 2;
        yOffset = lineWidth / 2;
      },

      setColour(newColour) {
        colour = newColour;
      },

      line(x1, y1, x2, y2) {
        const elLine = el.ownerDocument.createElementNS(SVG_NAMESPACE, "line");
        elLine.setAttribute("x1", xCoord(x1));
        elLine.setAttribute("y1", yCoord(y1));
        elLine.setAttribute("x2", xCoord(x2));
        elLine.setAttribute("y2", yCoord(y2));
        elLine.setAttribute("stroke", colour);
        elLine.setAttribute("stroke-width", lineWidth);
        elLine.setAttribute("stroke-linecap", "round");
        el.appendChild(elLine);
      },

      fillPolygon(...xyPoints) {
        const elPolygon = el.ownerDocument.createElementNS(
          SVG_NAMESPACE,
          "polygon",
        );
        const coordPairs = xyPoints.map(
          ({ x, y }) => `${xCoord(x)},${yCoord(y)}`,
        );
        elPolygon.setAttribute("points", coordPairs.join(" "));
        elPolygon.setAttribute("fill", colour);
        el.appendChild(elPolygon);
      },

      fillSegment(cx, cy, smallR, bigR, startAngle, endAngle) {
        const isCircle = endAngle - startAngle === Math.PI * 2;

        if (isCircle) {
          const elCircle = el.ownerDocument.createElementNS(
            SVG_NAMESPACE,
            "circle",
          );
          elCircle.setAttribute("cx", xCoord(cx));
          elCircle.setAttribute("cy", yCoord(cy));
          elCircle.setAttribute("r", distance(bigR - smallR));
          elCircle.setAttribute("fill", colour);
          el.appendChild(elCircle);
        } else {
          const innerStartX = xCoord(cx + smallR * Math.sin(startAngle));
          const innerStartY = yCoord(cy - smallR * Math.cos(startAngle));
          const innerEndX = xCoord(cx + smallR * Math.sin(endAngle));
          const innerEndY = yCoord(cy - smallR * Math.cos(endAngle));
          const outerStartX = xCoord(cx + bigR * Math.sin(startAngle));
          const outerStartY = yCoord(cy - bigR * Math.cos(startAngle));
          const outerEndX = xCoord(cx + bigR * Math.sin(endAngle));
          const outerEndY = yCoord(cy - bigR * Math.cos(endAngle));
          const isLargeArc = endAngle - startAngle > Math.PI / 2;

          const elPath = el.ownerDocument.createElementNS(
            SVG_NAMESPACE,
            "path",
          );
          const d = `
            M ${innerStartX} ${innerStartY} ${outerStartX} ${outerStartY}
            A ${distance(bigR)} ${distance(bigR)} 0 ${
              isLargeArc ? "1" : "0"
            } 1 ${outerEndX} ${outerEndY}
            L ${innerEndX} ${innerEndY}
            A ${distance(smallR)} ${distance(smallR)} 0 ${
              isLargeArc ? "1" : "0"
            } 0 ${innerStartX} ${innerStartY}
          `;

          elPath.setAttribute("fill", colour);
          elPath.setAttribute("d", d);
          el.appendChild(elPath);
        }
      },
      arc(cx, cy, r, startAngle, endAngle, fill = false) {
        if (fill) {
          // If fill is true and the arc is a full circle, render a filled circle
          const elCircle = el.ownerDocument.createElementNS(
            SVG_NAMESPACE,
            "circle",
          );
          elCircle.setAttribute("cx", xCoord(cx));
          elCircle.setAttribute("cy", yCoord(cy));
          elCircle.setAttribute("r", distance(r));
          elCircle.setAttribute("fill", colour);
          elCircle.setAttribute("stroke", "none"); // No stroke for a filled circle
          el.appendChild(elCircle);
        } else {
          // Otherwise, render an arc or a filled segment
          const [startX, startY] = polarToXy(cx, cy, r, startAngle),
            [endX, endY] = polarToXy(cx, cy, r, endAngle),
            radius = distance(r),
            isLargeArc = endAngle - startAngle > Math.PI / 2,
            d =
              `M ${startX} ${startY} A ${radius} ${radius} 0 ${isLargeArc ? "1" : "0"} 1 ${endX} ${endY}` +
              (fill ? " Z" : ""),
            elPath = el.ownerDocument.createElementNS(SVG_NAMESPACE, "path");
          elPath.setAttribute("d", d);
          if (fill) {
            elPath.setAttribute("fill", colour);
            elPath.setAttribute("stroke", "none");
          } else {
            elPath.setAttribute("fill", "none");
            elPath.setAttribute("stroke", colour);
          }
          elPath.setAttribute("stroke-width", lineWidth);
          elPath.setAttribute("stroke-linecap", "round");
          el.appendChild(elPath);
        }
      },
      convertCoords(x, y) {
        return [xCoord(x), yCoord(y)];
      },

      /**
       * Get the entire generated SVG as a string.
       * You can write this string to a file, or pass it along as needed.
       */
      getSVG() {
        return el.outerHTML;
      },
      on(eventName, handler) {},
      dispose() {},
    };
  },
};
