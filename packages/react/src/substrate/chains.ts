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
    logo: "/substrate/polkadot.svg",
    prefix: 0,
  },
  polkadot: {
    rpc: "wss://1rpc.io/dot",
    logo: "/substrate/polkadot.svg",
    prefix: 0,
  },
  kusama: {
    rpc: "wss://1rpc.io/ksm",
    logo: "/substrate/kusama.svg",
    prefix: 2,
  },
  astar: {
    rpc: "wss://1rpc.io/astr",
    logo: "/substrate/astar.svg",
    prefix: 5
  },
};
