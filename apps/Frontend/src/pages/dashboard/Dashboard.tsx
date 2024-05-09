import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../theme";
// import { mockTransactions } from "../../data/mockData";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Header from "../../components/Header";
import LineChart from "../../components/Linechart";
// import GeographyChart from "../../components/Geographychart";
import BarChart from "../../components/Barchart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { BASE_URL } from "../../config/config";
import { useEffect, useState } from "react";

const USERID = localStorage.getItem("userId");
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

  transactions.forEach(
    (transaction: { amount: any; platform: any; createdAt: any }) => {
      const { amount, platform, createdAt } = transaction;
      const month = new Date(createdAt).toLocaleString("en-US", {
        month: "long",
      });

      let parsedAmount = parseFloat(amount);
      if (platform === "Paystack") {
        parsedAmount /= 1200; // Divide by 1200 if platform is Paystack
      }

      if (Object.keys(monthlyAmount).includes(month)) {
        monthlyAmount[month] += parsedAmount;
      } else {
        console.error(`Invalid month encountered: ${month}`);
      }
    }
  );

  return monthlyAmount;
}

function calculateTotalAmount(monthlyAmounts: any): number {
  let totalAmount = 0;
  for (const month in monthlyAmounts) {
    totalAmount += monthlyAmounts[month];
  }
  const roundedNum = Math.round(totalAmount);
  return roundedNum;
}
const Dashboard = () => {
  const [transactionsCount, setTransactionCount] = useState<string>("");
  const [subscribersCount, setSubscriberCount] = useState<string>("");

  const [customersCount, setCustomersCount] = useState<string>("");

  const [botsCount, setBotsCount] = useState<string>("");
  const [yearlyRevenue, setYearlyRevenue] = useState<number>(0);

  useEffect(() => {
    const fetchDataAndGenerateData = async () => {
      const Revenue = calculateTotalAmount(await amount());
      setYearlyRevenue(Revenue); // Set data to empty array if mockLineData is null
    };

    fetchDataAndGenerateData();
  }, []);

  useEffect(() => {
    const transactionCount = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(
          BASE_URL + "/transaction/user/count/" + USERID
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.text();

        setTransactionCount(data);
        return data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    transactionCount();
  }, []);
  useEffect(() => {
    const subscriberCount = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(
          BASE_URL + "/subscribers/bot/count/" + USERID
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.text();
        setSubscriberCount(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    subscriberCount();
  }, []);

  useEffect(() => {
    const customerCount = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(
          BASE_URL + "/customers/user/count/" + USERID
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.text();
        setCustomersCount(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    customerCount();
  }, []);

  useEffect(() => {
    const botCount = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(BASE_URL + "/bot/user/count/" + USERID);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.text();
        setBotsCount(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    botCount();
  }, []);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  interface Transaction {
    id: string;
    customer: { firstName: string };
    createdAt: string;
    platform: string;
    amount: number;
  }
  const [rows, setRows] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(
          BASE_URL + "/transaction/user/recent/" + USERID
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      width={isMobile ? "100vw" : "81vw"}
      mr={isMobile ? "1vw" : "0.5vw"}
      ml={isMobile ? "1vw" : "17.5vw"}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          width={isMobile ? "26vw" : undefined}
          height={isMobile ? "12vh" : undefined}
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",

            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={transactionsCount}
            subtitle="Total Sales"
            progress="0.75"
            increase="+14%"
            isMobile={isMobile}
            icon={
              <CreditCardIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          width={isMobile ? "26vw" : undefined}
          height={isMobile ? "12vh" : undefined}
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={customersCount}
            subtitle="Total Clients"
            progress="0.30"
            increase="+5%"
            isMobile={isMobile}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          width={isMobile ? "26vw" : undefined}
          height={isMobile ? "12vh" : undefined}
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            // fontSize:"1px",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={subscribersCount}
            subtitle="Subscribers"
            progress="1"
            increase="+100%"
            isMobile={isMobile}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          width={isMobile ? "26vw" : undefined}
          height={isMobile ? "12vh" : undefined}
          sx={{
            backgroundColor: colors.primary[400],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <StatBox
            title={botsCount}
            subtitle="Bots Deployed"
            progress="0.80"
            increase=""
            isMobile={isMobile}
            icon={
              <SmartToyIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          mt={isMobile ? "-2.5rem" : undefined}
          mr={isMobile ? "20vw" : undefined}
          mb={isMobile ? "6vh" : undefined}
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "10px",
          }}
          // height="20vh"
        >
          <Box
            mt={isMobile ? "2rem" : "25px"}
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
            width={isMobile ? "100%" : undefined}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                ${yearlyRevenue.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Box
            height={"250px"}
            width={isMobile ? "60vw" : undefined}
            m="-20px 0 0 0"
            fontSize="10px"
          >
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          p="30px" // Fixed the typo from "30x" to "30px"
          gridRow="span 2"
          sx={{
            backgroundColor: colors.primary[400],
            overflow: "auto",
            height: "39rem",
            width: isMobile ? "16rem" : "28rem",
            borderRadius: "10px",
            mt: isMobile ? "-2.56rem" : undefined,
            ml: isMobile ? "-5.7rem" : undefined,
            // zIndex:"3"
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`6px solid ${colors.primary[500]}`}
            color={colors.grey[100]}
            p="18px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {rows.map((transaction, i) => (
            <Box
              key={`${transaction}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              gridColumn="span 4"
              gridRow="span 4"
              overflow="auto"
            >
              <Box>
                {/* <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.id}
                </Typography> */}
                <Typography fontSize={isMobile?"10px":undefined} color={colors.grey[100]}>
                  {transaction.customer.firstName}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>
              <Typography fontSize={isMobile?"10px":undefined}>
                {new Date(transaction.createdAt).toISOString().split("T")[0]}
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: colors.primary[400],
                }}
                p="5px 10px"
                borderRadius="4px"
              >
                <Typography fontSize={isMobile?"10px":undefined}>
                {transaction.platform === "Paystack" ? "₦" : "$"}
                {transaction.amount}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        {isMobile ? undefined : (
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            p="30px"
            sx={{
              backgroundColor: colors.primary[400],
              borderRadius: "10px",
            }}
          >
            <Typography variant="h5" fontWeight="600">
              Campaign
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              <ProgressCircle size={isMobile ? "70" : "125"} />
              <Typography
                variant="h5"
                color={colors.greenAccent[500]}
                sx={{ mt: "15px" }}
              >
                ${yearlyRevenue.toLocaleString()} revenue generated
              </Typography>
              <Typography>
                Includes extra misc expenditures and costs
              </Typography>
            </Box>
          </Box>
        )}
        <Box
          gridColumn={isMobile ? "span 6" : "span 4"}
          gridRow="span 2"
          mt={isMobile ? "-50px" : undefined}
          mb={isMobile ? "40px" : undefined}
          // width={isMobile?"20rem":undefined}
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "10px",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box
            height={isMobile?"280px":"250px"}
            width={isMobile ? "92vw" : "110%"}
            mt="-20px"
            ml={isMobile ? "-30px" : undefined}
            color="black"
          >
            <BarChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
