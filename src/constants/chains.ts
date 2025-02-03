import { match } from 'ts-pattern'
import { holesky } from 'viem/chains'
import { localhost, mainnet, sepolia } from 'wagmi/chains'

import { addEnsContracts } from '@ensdomains/ensjs'

import type { Register } from '@app/local-contracts'
import { makeLocalhostChainWithEns } from '@app/utils/chains/makeLocalhostChainWithEns'

const isLocalProvider = !!process.env.NEXT_PUBLIC_PROVIDER

export const deploymentAddresses = JSON.parse(
  process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES || '{}',
) as Register['deploymentAddresses']

export const localhostWithEns = makeLocalhostChainWithEns<typeof localhost>(
  localhost,
  deploymentAddresses,
)

const ENS_SUBGRAPH_API_KEY = '9ad5cff64d93ed2c33d1a57b3ec03ea9'

export const mainnetWithEns = {
  ...addEnsContracts(mainnet),
  subgraphs: {
    ens: {
      url: `https://gateway-arbitrum.network.thegraph.com/api/${ENS_SUBGRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`,
    },
  },
}
export const sepoliaWithEns = addEnsContracts(sepolia)
export const holeskyWithEns = addEnsContracts(holesky)

export const chainsWithEns = [
  mainnetWithEns,
  sepoliaWithEns,
  holeskyWithEns,
  localhostWithEns,
] as const

export const getSupportedChainById = (chainId: number | undefined) =>
  chainId ? chainsWithEns.find((c) => c.id === chainId) : undefined

export type SupportedChain =
  | typeof mainnetWithEns
  | typeof sepoliaWithEns
  | typeof holeskyWithEns
  | typeof localhostWithEns

export const getChainsFromUrl = () => {
  if (typeof window === 'undefined') {
    return [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      mainnetWithEns,
      sepoliaWithEns,
      holeskyWithEns,
    ]
  }

  const { hostname, search } = window.location
  const params = new URLSearchParams(search)
  const chainParam = params.get('chain')
  const segments = hostname.split('.')

  // holesky by default on staging
  if (segments.length === 4 && segments.slice(1).join('.') === 'ens-app-v3.pages.dev') {
    return [holeskyWithEns, mainnetWithEns, sepoliaWithEns]
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (chainParam) {
      if (chainParam === 'holesky') return [holeskyWithEns, sepoliaWithEns, mainnetWithEns]
      if (chainParam === 'sepolia') return [sepoliaWithEns, mainnetWithEns, holeskyWithEns]
    }
    return [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      holeskyWithEns,
      mainnetWithEns,
      sepoliaWithEns,
    ]
  }

  return match(segments[0])
    .with('sepolia', () => [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      sepoliaWithEns,
      mainnetWithEns,
      holeskyWithEns,
    ])
    .with('holesky', () => [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      holeskyWithEns,
      sepoliaWithEns,
      mainnetWithEns,
    ])
    .otherwise(() => [
      ...(isLocalProvider ? ([localhostWithEns] as const) : ([] as const)),
      mainnetWithEns,
      holeskyWithEns,
      sepoliaWithEns,
    ])
}
