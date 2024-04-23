import { useTheme } from "@mui/material";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoFeatures } from "../data/mockGeoFeatures";
import { tokens } from "../theme";
import { mockGeographyData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import { BASE_URL, USERID } from "../config/config";

const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions,setTransactions]=useState([])
interface ParsedTransaction {
    id: string;
    value: number;
}
function parseTransactions(transactions: any[]): ParsedTransaction[] {
  const transactionCountMap: { [country: string]: number } = {};

  transactions.forEach((transaction) => {
      const { country } = transaction;
      if (!transactionCountMap[country]) {
          transactionCountMap[country] = 1; // Initialize to 1 for the first occurrence
      } else {
          transactionCountMap[country] += 1; // Increment count for subsequent occurrences
      }
  });

  const parsedTransactions: ParsedTransaction[] = Object.keys(transactionCountMap).map((country) => ({
      id: country,
      value: transactionCountMap[country],
  }));

  return parsedTransactions;
}

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
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  fetchData();
}, []);
//@ts-ignore
const parsedTransactions: ParsedTransaction[] = parseTransactions(transactions);

  return (
    <ResponsiveChoropleth
      data={data}
      colors="blues"
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      features={geoFeatures.features}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 1000000]}
      unknownColor={colors.grey[100]}
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor="#ffffff"
      legends={
        !isDashboard
          ? [
              {
            
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
                
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
