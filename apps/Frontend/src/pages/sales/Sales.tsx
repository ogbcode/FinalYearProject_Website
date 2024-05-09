import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { BASE_URL, USERID } from "../../config/config";

const Sales = () => {
  const theme = useTheme();
  const [rows, setRows] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "transactionId",
      headerName: "ID",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      valueGetter: (params: any) => params.row.customer.firstName,
      
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },

    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params: any) => (
        <Typography color={colors.greenAccent[500]}>
          {params.row.platform === "Paystack" ? "₦" : "$"}
          {params.value}
        </Typography>
      ),
    },
    {
      field: "platform",
      headerName: "Payment Method",
      flex: 1,
    },
    {
      field: "duration",
      headerName: "Plan",
      flex: 1,
      valueGetter: (params: any) => {
        const duration = params.value;
        if (duration === "14") {
          return "2 Weeks";
        } else if (duration === "30") {
          return "1 Month";
        } else {
          return "Lifetime";
        }
      },
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      valueGetter: (params: any) => {
        const date = new Date(params.value);
        return date.toISOString().split("T")[0];
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(
          BASE_URL+"/transaction/user/"+USERID
        );
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mr={isMobile ? "1vw" : "0.5vw"} ml={isMobile ? "1vw" : "17.5vw"}>
      <Header title="SALES" subtitle="List of sales made" />
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

          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.grey[400]}`, // Add a border to separate cells
            padding: "5px", // Add padding to column headers and cells
          },
          ...(isMobile && {
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: colors.blueAccent[700], // Background color for column headers
              whiteSpace: "normal", // Prevent wrapping text in cells
              overflow: "hidden", // Hide overflowing text in cells
              textOverflow: "ellipsis",
            },
            '@media (hover: none)': {
              '&& .MuiDataGrid-menuIcon': {
                width: 0,
                visibility: 'hidden',
              },
              '&& .MuiDataGrid-sortIcon': {
                width: 0,
                visibility: 'hidden',
              }
            },
            '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-menuIcon': {
              width: '25px',
              visibility: 'visible',
            },
            '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
              width: 'auto',
              visibility: 'visible',
            }
          }),
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          sx={{
            fontSize:isMobile?"9px":undefined
          }}
        />
      </Box>
    </Box>
  );
};

export default Sales;
