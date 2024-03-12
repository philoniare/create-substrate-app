interface ChainProviders {
  [key: string]: {
    rpc: string;
    logo: string;
    prefix: number;
  };
}

export const CHAIN_PROVIDERS: ChainProviders = {
  default: {
    rpc: "wss://1rpc.io/dot",
    logo: "assets/substrate/polkadot.svg",
    prefix: 0,
  },
  polkadot: {
    rpc: "wss://1rpc.io/dot",
    logo: "assets/substrate/polkadot.svg",
    prefix: 0,
  },
  kusama: {
    rpc: "wss://1rpc.io/ksm",
    logo: "assets/substrate/kusama.svg",
    prefix: 2,
  },
  astar: {
    rpc: "wss://1rpc.io/astr",
    logo: "assets/substrate/astar.svg",
    prefix: 5,
  },
};
