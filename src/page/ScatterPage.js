import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import * as d3 from "d3";
import Scatter from "../chart/Scatter";
import Linechart from "../chart/Linechart";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Crop54RoundedIcon from '@material-ui/icons/Crop54Rounded';
import FilterNoneRoundedIcon from '@material-ui/icons/FilterNoneRounded';
import GestureRoundedIcon from '@material-ui/icons/GestureRounded';

const ScatterPage = (props) => {
  const { data, height, width, margin, rawdata } = props;
  // console.log(data);
  const [datex0, setDatex0] = useState("");
  const [datex1, setDatex1] = useState("");
  const [points, setPoints] = useState([]);
  const [brushScatter, setBrushScatter] = useState(false);
  const [tools, setTools] = useState("");
  const [selectedData, setSelectedData ] = useState([]);

  const handleTools = (event, newTools) => {
    setTools(newTools);
  };

  const gridContainer = {
    display: "grid",
    grid: "auto /auto auto",
    gridGap: "10px",
  };
  const gridItems = {
    padding: "0 5px",
  };

  const brushTools = useCallback(
    (c) => {
      setBrushScatter(c);
    },
    [setBrushScatter]
  );

  const pullX01 = useCallback(
    (x0, x1) => {
      setDatex0(x0);
      setDatex1(x1);
    },
    [setDatex0, setDatex1]
  );

  const pullXY = useCallback(
    (datapoint) => {
      setPoints(datapoint);
    },
    [setPoints]
  );

  return (
    <>
      <br></br>
      <ToggleButtonGroup
        value={tools}
        exclusive
        onChange={handleTools}
      >
        <ToggleButton value="brush">
          <Crop54RoundedIcon />
        </ToggleButton>
        <ToggleButton value="multiBrush">
          <FilterNoneRoundedIcon />
        </ToggleButton>
        <ToggleButton value="lessoBrush">
          <GestureRoundedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <div style={gridContainer}>
        <div style={gridItems}>
          <Scatter
            data={rawdata}
            width={width}
            height={height}
            margin={margin}
            x0={datex0}
            x1={datex1}
            tools={tools}
            pullXY={pullXY}
            brushTools={brushTools}
          ></Scatter>
        </div>
        <div style={gridItems}>
          <Linechart
            data={data}
            height={600}
            width={800}
            margin={margin}
            points={points}
            brushScatter={brushScatter}
            tools={tools}
            pullX01={pullX01}
          ></Linechart>
        </div>
      </div>
    </>
  );
};
export default ScatterPage;
