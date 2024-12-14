const Web3 = require('web3').default;
require('dotenv').config();

async function getERC20Balance(walletAddress, tokenAddress, provider) {
  try {
    const web3 = new Web3(provider);

    const abi = [
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ];
    const tokenContract = new web3.eth.Contract(abi, tokenAddress);

    const getTokenBalance = BigInt(
      await tokenContract.methods.balanceOf(walletAddress).call()
    );

    const TokenDecimals = parseInt(
      await tokenContract.methods.decimals().call(),
      10
    );

    const divisor = BigInt(10 ** TokenDecimals);
    const TokenBalance = getTokenBalance / divisor;

    return TokenBalance.toString();
  } catch (error) {
    console.error('Error fetching Token balance:', error);
  }
}
(async () => {
  const walletAddress = process.env.WALLET_ADDRESS;
  const tokenAddress = process.env.TOKEN_ADDRESS;
  const provider = process.env.PROVIDER_URL;

  const balance = await getERC20Balance(walletAddress, tokenAddress, provider);
  console.log(`Token Balance: ${balance}`);
})();
