import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const SimpleDataGrid = (props) => {
  const { data, rawdata, x0, x1 } = props;
  const parseDate = d3.timeParse("%Y-%m");
  const colsData = rawdata.columns.map((d) => {
    return {
      field: d,
      headerName: d,
      width: 200,
    };
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "Date",
      headerName: "Date",
      width: 200,
    },
    ...colsData,
  ];
  const rawrows = rawdata.map((d, index) => {
    const dx0 = parseDate(x0);
    const dx1 = parseDate(x1);
    const timestamp = parseDate(d.Date);
    return {
      id: index + 1,
      TimeStamp:
        timestamp.getTime() >= dx0.getTime() &&
        timestamp.getTime() <= dx1.getTime(),
      ...d,
    };
  });
  const rows = rawrows.filter((r) => r.TimeStamp == true);
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={50}
        disableSelectionOnClick
      />
    </div>
  );
};
export default SimpleDataGrid;
