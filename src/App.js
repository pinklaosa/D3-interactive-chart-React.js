import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import Linechart from "./component/Linechart";

function App() {
  const [data, setData] = useState([]);
  const parseDate = d3.timeParse("%Y-%m");
  useEffect(() => {
    const d = [10,20,80,5,60,30,40,50];
    setData(d);
    // d3.csv('data/data-extant.csv').then((d) => {
    //   const loaddata = d.columns.slice(1).map((sensor) => {
    //     return {
    //       col: sensor,
    //       values: d.map((v) => {
    //         return {
    //           date: parseDate(v.Date),
    //           vSensor: +v[sensor],
    //         };
    //       }),
    //     };
    //   });
    //   setData(loaddata);
    // });
    return () => undefined;
  }, [d]);
  
  return (
    <div className="App">
      <Linechart data={data} width={1000} height={500}/>
    </div>
  );
}
export default App;
