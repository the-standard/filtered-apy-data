const axios = require('axios');
const fs = require('fs');

const tokenHypervisors = [
  "0x52ee1FFBA696c5E9b0Bc177A9f8a3098420EA691",
  "0x330DFC5Bc1a63A1dCf1cD5bc9aD3D5e5E61Bcb6C",
  "0xfA392dbefd2d5ec891eF5aEB87397A89843a8260",
  "0xf08bdbc590c59cb7b27a8d224e419ef058952b5f",
  "0x2bcbdd577616357464cfe307bc67f9e820a66e80",
];

const fetchData = async () => {
  const filteredData = {
    timestamp: new Date().toISOString(),
    data: {}
  };

  for (const hypervisor of tokenHypervisors) {
    try {
      const response = await axios.get(`https://wire2.gamma.xyz/arbitrum/hypervisors/${hypervisor}/feeReturns/daily`);
      filteredData.data[hypervisor] = { feeApy: response.data.feeApy };
    } catch (error) {
      console.error(`Failed to fetch data for ${hypervisor}, error`);
    }
  }

  fs.writeFileSync('apy-data.json', JSON.stringify(filteredData, null, 2));
};

fetchData();
