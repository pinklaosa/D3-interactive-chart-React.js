import { DataGrid } from "@material-ui/data-grid";
import Radio from "@material-ui/core/Radio";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const SelectDateTable = (props) => {
  const { rows } = props;

  const [selectionModel, setSelectionModel] = React.useState([]);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "start",
      headerName: "Start",
      width: 130,
    },
    {
      field: "end",
      headerName: "End",
      width: 130,
    },
  ];

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        hideFooterPagination
        checkboxSelection
        disableSelectionOnClick
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
      />
      {selectionModel.map((val) => (
        <h1>
          {rows[val - 1].start} - {rows[val - 1].end}
        </h1>
      ))}
    </div>
  );
};
export default SelectDateTable;
