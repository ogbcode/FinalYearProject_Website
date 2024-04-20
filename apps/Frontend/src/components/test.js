// Sample response from the transaction API
const transactions = [
    {
      "id": "ab92da85-c9bc-46da-a961-e75da5219715",
      "transactionId": "3712919284",
      "status": "SUCCESS",
      "amount": "32000.0",
      "currency": "Naira",
      "platform": "Paystack",
      "duration": "30",
      "createdAt": "2024-04-14T12:47:25.033Z",
      "updatedAt": "2024-04-14T12:47:25.033Z",
      "customer": {
          "id": "864135cf-ccae-47bb-b0f6-d2f28b2737a2",
          "firstName": "OGB",
          "telegramId": "1591573930",
          "createdAt": "2024-04-14T12:03:15.428Z",
          "updatedAt": "2024-04-14T12:03:15.428Z"
      }
    },
    {
      "id": "38f789c2-a5ce-4733-adc9-9a11e174c7c4",
      "transactionId": "TFDtW4FrZ2i",
      "status": "SUCCESS",
      "amount": "180",
      "currency": "USD",
      "platform": "Token",
      "duration": "99999",
      "createdAt": "2024-04-14T13:43:48.797Z",
      "updatedAt": "2024-04-14T13:43:48.797Z",
      "customer": {
          "id": "864135cf-ccae-47bb-b0f6-d2f28b2737a2",
          "firstName": "OGB",
          "telegramId": "1591573930",
          "createdAt": "2024-04-14T12:03:15.428Z",
          "updatedAt": "2024-04-14T12:03:15.428Z"
      }
    }
  ];
  
  // Function to calculate the total amount for each month
  function calculateMonthlyAmount(transactions) {
    const monthlyAmount = {
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
  
    transactions.forEach(transaction => {
      const { amount, platform, createdAt } = transaction;
      const month = new Date(createdAt).toLocaleString('en-US', { month: 'long' });
  
      let parsedAmount = parseFloat(amount);
      if (platform === 'Paystack') {
        parsedAmount /= 1200; // Divide by 1200 if platform is Paystack
      }
  
      monthlyAmount[month] += parsedAmount;
    });
  
    return monthlyAmount;
  }
  
  // Calculate the total amount for each month
  const totalAmountPerMonth = calculateMonthlyAmount(transactions);
  console.log(totalAmountPerMonth);
  