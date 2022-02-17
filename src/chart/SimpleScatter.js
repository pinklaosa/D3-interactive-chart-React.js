import React, { useEffect, memo } from "react";
import * as d3 from "d3";

const SimpleScatter = (props) => {
  const { data, height, width, margin } = props;

  useEffect(() => {
    plotChart();
  }, [data]);

  const plotChart = () => {
    console.log(data);
    const buildSVG = d3
      .select("simplescatter")
      .append("svg")
      .attr("id", "simplescatterplotSVG")
      .attr("height", height)
      .attr("width", width);

    const columnsCsv = Object.keys(data[0]);
    console.log(d3.max(data, (d)=> d[columnsCsv[2]]));
  };
  return <div id="simplescatter"></div>;
};
export default SimpleScatter;
