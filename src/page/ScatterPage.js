import React, { useEffect, useState, memo, useRef, useMemo } from "react";
import * as d3 from "d3";
import Scatter from "../chart/Scatter";

const ScatterPage = (props) => {
  const { data, height,width, margin, rawdata } = props;
  const gridContainer = {
    display: "grid",
    grid: "auto /auto auto",
    gridGap: "10px",
    contentAlign: "left",
  };
  const gridItems = {
    padding: "0 50px",
    textAlign: "start",
  };
  return (
    <div style={gridContainer}>
      <div style={gridItems}>
        <Scatter
            data={rawdata}
            width={width}
            height={height}
            margin={margin}
        ></Scatter>
      </div>
      <div style={gridItems}>
        <h1>2</h1>
      </div>
    </div>
  );
};
export default ScatterPage;
