interface ChainProviders {
  [key: string]: {
    rpc: string;
    logo: string;
  };
}

export const CHAIN_PROVIDERS: ChainProviders = {
  default: {
    rpc: "wss://1rpc.io/dot",
    logo: "/substrate/polkadot.svg",
  },
  polkadot: {
    rpc: "wss://1rpc.io/dot",
    logo: "/substrate/polkadot.svg",
  },
  kusama: {
    rpc: "wss://1rpc.io/ksm",
    logo: "/substrate/kusama.svg",
  },
  astar: {
    rpc: "wss://1rpc.io/astr",
    logo: "/substrate/astar.svg",
  },
};
