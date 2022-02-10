import React, { useEffect } from "react";
import * as d3 from "d3";

function Linechart(props) {
  const { data, width, height } = props;
  console.log(data);
  useEffect(() => {
      drawChart();
  }, [data]);

  const drawChart = () => {
    
  };
  return <div id="linechart"></div>;
}
export default Linechart;
