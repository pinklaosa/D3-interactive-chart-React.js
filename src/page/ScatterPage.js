import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import * as d3 from "d3";
import Scatter from "../chart/Scatter";
import Linechart from "../chart/Linechart";

const ScatterPage = (props) => {
  const { data, height, width, margin, rawdata } = props;
  // console.log(data);
  const [datex0, setDatex0] = useState("");
  const [datex1, setDatex1] = useState("");
  const gridContainer = {
    display: "grid",
    grid: "auto /auto auto",
    gridGap: "10px",
  };
  const gridItems = {
    padding: "0 5px",
  };

  const pullX01 = useCallback(
    (x0, x1) => {
      setDatex0(x0);
      setDatex1(x1);
    },
    [setDatex0, setDatex1]
  );

  return (
    <div style={gridContainer}>
      <div style={gridItems}>
        <Scatter
          data={rawdata}
          width={width}
          height={height}
          margin={margin}
          x0={datex0}
          x1={datex1}
        ></Scatter>
      </div>
      <div style={gridItems}>
        <Linechart
          data={data}
          height={600}
          width={800}
          margin={margin}
          pullX01={pullX01}
        ></Linechart>
      </div>
    </div>
  );
};
export default ScatterPage;
