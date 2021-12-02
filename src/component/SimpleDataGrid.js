import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";

const SimpleDataGrid = (props) => {
  const { data } = props;
  const formatDate = (datetime) =>
    datetime.getDate() +
    "-" +
    (datetime.getMonth() + 1) +
    "-" +
    datetime.getFullYear() +
    "  " +
    datetime.getHours() +
    ":" +
    datetime.getMinutes() +
    ":" +
    datetime.getSeconds();

  const columnsData = data.map(({ col }) => {
    return {
      field: col.toLowerCase(),
      headerName: col,
      width: 200,
      editable: true,
    };
  });
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
      editable: true,
    },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      editable: true,
    },
    ...columnsData,
  ];

  const fullDate = data.map((d) => d.values.map((v) => v.date));
  const date = fullDate.pop();
  const rows = date.map((d, index) => {
    return {
      id: index + 1,
      date: formatDate(d),
      chrome: "c",
      firefox:"f",
      internet_explorer:"i",
      opera:"o",
      safari:"s",
    };
  });
  console.log(rows);
  console.log(columns);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
          rows={rows}
          columns={columns}
          pageSize={100}
          checkboxSelection
          disableSelectionOnClick
        />
    </div>
  );
};
export default SimpleDataGrid;
