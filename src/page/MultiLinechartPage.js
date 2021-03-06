import React, { useState, useCallback } from "react";
import SelectDataTable from "../component/SelectDataTable";
import Grid from "@material-ui/core/Grid";
import SelectDateTable from "../component/SelectDateTable";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import MultiLinechart from "../chart/MultiLinechart";
import * as d3 from "d3";

const useStyles = makeStyles((theme) => ({
  btnselect: {
    marginLeft: 50,
  },
}));

const MultiLinechartPage = (props) => {
  const classes = useStyles();
  const { data, rawdata, height, width, margin } = props;
  const parseDate = d3.timeParse("%Y-%m");

  const [datex0, setDatex0] = useState("");
  const [datex1, setDatex1] = useState("");
  const [listDate, setListDate] = useState();
  const [rowsDate, setRows] = useState([]);
  const [listData , setListData] = useState([]);
  const [brushToolCheck, setBrushToolCheck] = useState("on");

  const pullX1 = useCallback(
    (x0, x1) => {
      setDatex0(x0);
      setDatex1(x1);
    },
    [setDatex1, setDatex0]
  );

  const sendDate = useCallback(
    (ids, rows) => {
      if (ids.length > 0) {
        setBrushToolCheck("off");
        setDatex0("");
        setDatex1("");
        let listSelected = rows.filter((r) => ids.includes(r.id));
        if (listSelected.length > 0) {
          for (let i = 0; i < listSelected.length; i++) {
            const dx0 = parseDate(listSelected[i].start);
            const dx1 = parseDate(listSelected[i].end);
            const rawrows = rawdata.map((d, index) => {
              const timestamp = parseDate(d.Date);
              return {
                id: index + 1,
                CheckTimeStamp:
                  listSelected[i].start !== "" && listSelected[i].end !== ""
                    ? timestamp.getTime() >= dx0.getTime() &&
                      timestamp.getTime() <= dx1.getTime()
                    : false,
                ...d,
              };
            });
            // console.log(rawrows);
            const row = rawrows.filter((r) => r.CheckTimeStamp == true);
            // console.log(row);
            const dataFromDate = [...listData,...row];
            // console.log(dataFromDate);
            setListData(dataFromDate);
          }
        }
        setListDate(listSelected);
      } else {
        setBrushToolCheck("on");
      }
    },
    [setListDate]
  );

  return (
    <div id="container">
      <MultiLinechart
        data={data}
        height={height}
        width={width}
        margin={margin}
        brushToolCheck={brushToolCheck}
        listDate={listDate}
        pullX1={pullX1}
      ></MultiLinechart>
      <Grid container spacing={3}>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnselect}
            id="btnselection"
            onClick={() => {
              let listDate = [
                ...rowsDate,
                { id: rowsDate.length + 1, start: datex0, end: datex1 },
              ];
              setRows(listDate);
            }}
          >
            Select
          </Button>
        </Grid>
        <Grid>
          <div id="details"></div>
        </Grid>
      </Grid>
      <div id="table_datagrid">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SelectDateTable
              rows={rowsDate}
              sendDate={sendDate}
            ></SelectDateTable>
          </Grid>
          <Grid item xs={9}>
            <SelectDataTable
              rawdata={rawdata}
              x0={datex0}
              x1={datex1}
              listData={listData}
            ></SelectDataTable>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default MultiLinechartPage;
