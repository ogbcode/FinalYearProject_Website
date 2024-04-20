import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { BASE_URL, USERID } from "../config/config";
import { useEffect, useState } from "react";

interface SalesByMonth {
  month: string;
  sales: number;
  salesColor: string;
}

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
    return data
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



const BarChart = ({ isDashboard = false }) => {
  const [datax, setData] = useState<SalesByMonth[]>([]);

  useEffect(() => {
    const organizeTransactionsByMonth= async () =>  {
      try {
        const salesByMonth: { [key: string]: SalesByMonth } = {};
        const transactions = await fetchData();
    
        transactions.forEach((transaction: { createdAt: string | number | Date; }) => {
          const createdAt = new Date(transaction.createdAt);
          const month = createdAt.toLocaleString('default', { month: 'long' });
    
          if (!salesByMonth[month]) {
            salesByMonth[month] = {
              month,
              sales: 1, // Initialize sales count to 1 for the first transaction in the month
              salesColor:"hsl(185, 70%, 50%)",
            };
          } else {
            salesByMonth[month].sales += 1; // Increment sales count for subsequent transactions in the month
          }
        });
    
        setData(Object.values(salesByMonth))
      } catch (error) {
        console.error("Error organizing transactions by month:", error);
        return []; // Return empty array or handle error as needed
      }
    };
    organizeTransactionsByMonth();
    }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ResponsiveBar
    // @ts-ignore
      data={datax}
      theme={{
        // added
        axis: {
          domain: {
            line: {
              stroke: colors.greenAccent[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[900],
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
      keys={["sales"]} // updated keys
      indexBy="month" // updated to lowercase "month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "month", // changed
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "sales", // changed
        legendPosition: "middle",
        legendOffset: -40,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
