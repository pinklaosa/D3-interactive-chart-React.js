import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as d3 from "d3";
import Linechart from "./chart/Linechart";
import MultiLinechart from "./chart/MultiLinechart";
import Navbar from "./component/Navbar";
import FCLine from "./chart/FCLine";

function App() {
  const [data, setData] = useState([]);
  const parseDate = d3.timeParse("%Y-%m");
  useEffect(() => {
    d3.csv("data/data-extant.csv").then((d) => {
      const loaddata = d.columns.slice(1).map((sensor) => {
        return {
          col: sensor,
          values: d.map((v) => {
            return {
              date: parseDate(v.Date),
              vSensor: +v[sensor],
            };
          }),
        };
      });
      setData(loaddata);
    });
  }, []);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          <Route path="/d3fc">
            <FCLine/>
          </Route>
          <Route path="/simpleline">
            <Linechart
              data={[10, 20, 80, 5, 60, 30, 40, 50]}
              width={1000}
              height={500}
            />
          </Route>
          <Route path="/multiline">
            <MultiLinechart
              data={data}
              height={550}
              width={1000}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            ></MultiLinechart>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
