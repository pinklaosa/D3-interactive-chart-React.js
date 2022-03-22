import React, { useEffect } from "react";
import * as d3 from "d3";
import * as selection from "d3-selection";
import pointInPolygon from "point-in-polygon";

const Lasso = () => {
  useEffect(() => {
    buildLasso();
  }, []);

  const buildLasso = () => {
    let items = [],
      closePathDistance = 75,
      closePathSelect = true,
      isPathClosed = false,
      hoverSelect = true,
      targetArea;

    const svg = d3
      .select(".canvas")
      .append("svg")
      .attr("width", "1000")
      .attr("height", "500")
      .style("border", "1px solid black");

    const g = svg.append("g").attr("class", "lasso");

    const dyn_path = g.append("path").attr("class", "drawn");

    const close_path = g.append("path").attr("class", "loop_close");

    const origin_node = g.append("circle").attr("class", "origin");

    let tpath;

    let origin;

    let torigin;

    let drawnCoords;

    // Apply drag behaviors
    const dragme = d3
      .drag()
      .on("start", dragstart)
      .on("drag", draging)
      .on("end", dragend);

    function dragstart() {
      drawnCoords = [];

      tpath = "";
      dyn_path.attr("d", null);
      close_path.attr("d", null);

     
    }

    function draging() {
      
    
      svg.on("click", (event) => {
        const coords = d3.pointer(event, g.node());
        const tx = coords[0];
        const ty = coords[1];

        if (tpath === "") {
          tpath = tpath + "M " + tx + " " + ty;
          torigin = [tx, ty];
          origin_node
            .attr("cx", tx)
            .attr("cy", ty)
            .attr("r", 7)
            .attr("display", null);
        } else {
          tpath = tpath + " L " + tx + " " + ty;
        }
      });
    }

    function dragend() {}

    svg.call(dragme);
  };
  return (
    <>
      <br></br>
      <div class="canvas"></div>
    </>
  );
};
export default Lasso;
