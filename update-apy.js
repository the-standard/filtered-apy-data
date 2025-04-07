const axios = require('axios');
const fs = require('fs');

const tokenHypervisors = [
  "0x547a116a2622876ce1c8d19d41c683c8f7bec5c0",
  "0x52ee1FFBA696c5E9b0Bc177A9f8a3098420EA691",
  "0x330DFC5Bc1a63A1dCf1cD5bc9aD3D5e5E61Bcb6C",
  "0xfA392dbefd2d5ec891eF5aEB87397A89843a8260",
  "0xf08bdbc590c59cb7b27a8d224e419ef058952b5f",
  "0x2bcbdd577616357464cfe307bc67f9e820a66e80",
];

const fetchData = async () => {
  let filteredData = {
    timestamp: new Date().toISOString(),
    data: {}
  };

  try {
    const response = await axios.get(
      `https://wire3.gamma.xyz/frontend/hypervisors/allDataSummary?chain=arbitrum&protocol=uniswapv3`
    );

    const useResponse = response?.data;

    tokenHypervisors && tokenHypervisors.length && tokenHypervisors.forEach((address) => {
      const useAddress = address.toLowerCase();

      const useData = useResponse.find(hypervisor => (
        hypervisor.address.toLowerCase() === hyperAddress.toLowerCase()
      ))

      let useApy = 0;
      if (useData?.feeApy != null && useData?.feeApy >= 0) {
        useApy = Number(useData?.feeApy);
      }

      filteredData.data[useAddress] = { feeApy: Number(useApy) };
    });
  } catch (error) {
    console.error(`Failed to fetch hypervisor data`, error);
    console.log('Attempting to fallback to old data')
    fetch('https://raw.githubusercontent.com/the-standard/filtered-apy-data/main/apy-data.json')
      .then( res => res.json() )
      .then(response => {
        console.log('Falling back to old data')
        filteredData = response;
      })
      .catch(error => {
        console.error('Failed to fallback to old data:', error)
      });
  }

  fs.writeFileSync('apy-data.json', JSON.stringify(filteredData, null, 2));
};

fetchData();
