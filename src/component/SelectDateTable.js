import { DataGrid } from "@material-ui/data-grid";
import Radio from "@material-ui/core/Radio";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const SelectDateTable = (props) => {
  const { rows } = props;
  let radioChecked = [rows[0].id];

  const [selectionModel, setSelectionModel] = React.useState(radioChecked);
  radioChecked = selectionModel;

  const selectedRow = rows.filter((item) => {
    return item.id === selectionModel[0];
  });
  const columns = [
    {
      field: "radiobutton",
      headerName: " ",
      width: 60,
      sortable: false,
      renderCell: (params) => {
        return (
          <Radio
            checked={radioChecked[0] === params.id}
            value={params.id}
            color="primary"
          />
        );
      },
    },
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
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
      />
    </div>
  );
};
export default SelectDateTable;
