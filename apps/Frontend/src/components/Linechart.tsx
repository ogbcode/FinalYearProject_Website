import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
// import { mockLineData as data } from "../data/mockData";
import { BASE_URL, USERID } from "../config/config";
import { useEffect, useState } from "react"


const fetchData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transaction/user/${USERID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
interface LineChartData {
  id: string;
  color: string;
  data: { x: string; y: number }[];
}

async function amount() {
  const transactions = await fetchData();

  const monthlyAmount: { [key: string]: number } = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  transactions.forEach((transaction: { amount: any; platform: any; createdAt: any; }) => {
    const { amount, platform, createdAt } = transaction;
    const month = new Date(createdAt).toLocaleString('en-US', { month: 'long' });

    let parsedAmount = parseFloat(amount);
    if (platform === 'Paystack') {
      parsedAmount /= 1200; // Divide by 1200 if platform is Paystack
    }

    if (Object.keys(monthlyAmount).includes(month)) {
      monthlyAmount[month] += parsedAmount;
    } else {
      console.error(`Invalid month encountered: ${month}`);
    }
  });
  
  return monthlyAmount;
}



const generateMockLineData = async (): Promise<LineChartData[]> => {
  const monthlyAmount = await amount();
 
  const mockLineData = [
    {
      id: "Sales",
      color: tokens("dark").greenAccent[500],
      data: [
        { x: "January", y: monthlyAmount.January },
        { x: "February", y: monthlyAmount.February },
        { x: "March", y: monthlyAmount.March },
        { x: "April", y: monthlyAmount.April },
        { x: "May", y: monthlyAmount.May },
        { x: "June", y: monthlyAmount.June },
        { x: "July", y: monthlyAmount.July },
        // { x: "August", y: monthlyAmount.August },
        // { x: "September", y: monthlyAmount.September },
        // { x: "October", y: monthlyAmount.October },
        // { x: "November", y: monthlyAmount.November },
        // { x: "December", y: monthlyAmount.December },
      ],
    },
  ];

  return mockLineData;
};





const LineChart = ({
  // isCustomLineColors = false,
  isDashboard = false,
}: {
  // isCustomLineColors?: boolean;
  isDashboard?: boolean;
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState<LineChartData[]>([]);
  useEffect(() => {
    const fetchDataAndGenerateData = async () => {
      const mockLineData = await generateMockLineData();
      setData(mockLineData || []); // Set data to empty array if mockLineData is null
    };

    fetchDataAndGenerateData();
  }, []);
  return (
    <ResponsiveLine
      data={data}
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
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickValues: 5, // added
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count", // added
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;

