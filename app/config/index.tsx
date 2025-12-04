import { http, createConfig } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

// Simple wagmi config without wallet connection (for demo with mock data)
// Uses public Base Sepolia RPC endpoint
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
})
