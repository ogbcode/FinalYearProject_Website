import { Box } from "@mui/material";
import { DataGrid, GridAlignment, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";

const Subscriber = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      headerAlign: "center"  as GridAlignment,
      align: "center" as GridAlignment
    },

    {
      field: "telegramId",
      headerName: "TelegramId",
      flex: 1,
    },

    {
      field: "botName",
      headerName: "Bot",
      flex: 1,
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      valueGetter: (params: any) => {
          const duration = params.value;
          return duration+" days";
        
      },
    },
    {
      field: "joinDate",
      headerName: "Date Joined",
      flex: 1,
      valueGetter: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toISOString().split("T")[0];
        } else {
          return ""; 
        }
      },
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      flex: 1,
      valueGetter: (params: any) => {
        if (params.value) {
          const date = new Date(params.value);
          return date.toISOString().split("T")[0];
        } else {
          return ""; 
        }
      },
    },
    
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      valueGetter: (params:any) => {
        const date = new Date(params.value);
        return date.toISOString().split("T")[0];
      },
    },

  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch('http://127.0.0.1:3000/backend/v1/subscribers/bot/b884da75-1797-4ff8-8b89-2baf7bcb3462');
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // console.log(data)
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Box m="20px" ml="280px"
    >
      <Header
        title="SUBSCRIBERS"
        subtitle="List of paid subscribers"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Subscriber;
