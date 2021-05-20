import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();
import '@nomiclabs/hardhat-waffle';
import { HardhatUserConfig } from 'hardhat/types';
import { task } from 'hardhat/config';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

task('accounts', 'Prints the list of accounts', async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || '';
const ACCOUNT_PRIVATE_KEY =
  process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY ||
  '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3'; // well known private key;

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [ACCOUNT_PRIVATE_KEY!],
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.4.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    artifacts: './artifacts',
  },
};

export default config;
