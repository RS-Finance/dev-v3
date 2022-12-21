require('dotenv').config({ path: process.env.INIT_CWD + '/.env.local' })
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env',
  override: true,
})
require('dotenv').config({
  path: process.env.INIT_CWD + '/.env.development.local',
  override: true,
})

process.env.ADDRESS_ETH_REGISTRAR = '0xe8f73bcfe882F5Cd49DCd4c5049c49Fa98607dCC'
process.env.ADDRESS_NAME_WRAPPER = '0xc74573988365C8e99de5ECC391b9b92E4B70227B'
process.env.BATCH_GATEWAY_URLS = JSON.stringify([
  '',
])

/**
 * @type {import('@ensdomains/ens-test-env').ENSTestEnvConfig}
 **/
module.exports = {
  deployCommand: 'pnpm hardhat deploy',
  buildCommand: 'pnpm build:glocal',
  scripts: [
    {
      command: 'pnpm start',
      name: 'nextjs',
      prefixColor: 'magenta.bold',
    },
    {
      command: `pnpm wait-on http://localhost:3000 && ${
        process.env.CI ? 'pnpm synpress:ci' : 'pnpm synpress:start'
      }`,
      name: 'synpress',
      prefixColor: 'yellow.bold',
      env: process.env,
      finishOnExit: true,
    },
  ],
  paths: {
    data: './data',
  },
}
