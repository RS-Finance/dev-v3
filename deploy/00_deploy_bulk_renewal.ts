/* eslint-disable import/no-extraneous-dependencies */
import { namehash } from 'ethers/lib/utils'
import { ethers } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const labelHash = (label: string) => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(label))

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts, deployments, network } = hre
  const { deploy } = deployments
  const { deployer, owner } = await getNamedAccounts()

  if (!network.tags.use_root) {
    return true
  }

  const root = await ethers.getContract('Root', await ethers.getSigner(owner))
  const registry = await ethers.getContract('ENSRegistry', await ethers.getSigner(owner))
  const resolver = await ethers.getContract('PublicResolver', await ethers.getSigner(owner))
  const registrar = await ethers.getContract('BaseRegistrarImplementation')
  const controller = await ethers.getContract('ETHRegistrarController')

  const bulkRenewal = await deploy('BulkRenewal', {
    from: deployer,
    args: [registry.address],
    log: true,
  })

  console.log('Temporarily setting owner of arb tld to owner ')
  const tx = await root.setSubnodeOwner(labelHash('arb'), owner)
  await tx.wait()

  console.log('Set default resolver for arb tld to public resolver')
  const tx111 = await registry.setResolver(namehash('arb'), resolver.address)
  await tx111.wait()

  console.log('Set interface implementor of arb tld for bulk renewal')
  const tx2 = await resolver.setInterface(
    ethers.utils.namehash('arb'),
    '0x3150bfba',
    bulkRenewal.address,
  )
  await tx2.wait()

  console.log('Set interface implementor of arb tld for registrar controller')
  const tx3 = await resolver.setInterface(
    ethers.utils.namehash('arb'),
    '0xdf7ed181',
    controller.address,
  )
  await tx3.wait()

  console.log('Set owner of arb tld back to registrar')
  const tx11 = await root.setSubnodeOwner(labelHash('arb'), registrar.address)
  await tx11.wait()

  return true
}

func.id = 'bulk-renewal'
func.tags = ['ethregistrar', 'BulkRenewal', 'Root']
func.dependencies = [
  'root',
  'registry',
  'BaseRegistrarImplementation',
  'PublicResolver',
  'ETHRegistrarController',
]

export default func
