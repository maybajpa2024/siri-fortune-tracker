exports.handler = async (event, context) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  // Your Google Sheets API call code here
  // Example:
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:append?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[/* your payment data */]]
    })
  });
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ success: true })
  };
};
