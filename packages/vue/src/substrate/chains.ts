interface ChainProviders {
  [key: string]: {
    rpc: string;
    logo: string;
  };
}

export const CHAIN_PROVIDERS: ChainProviders = {
  default: {
    rpc: "wss://1rpc.io/dot",
    logo: "assets/substrate/polkadot.svg",
  },
  polkadot: {
    rpc: "wss://1rpc.io/dot",
    logo: "assets/substrate/polkadot.svg",
  },
  kusama: {
    rpc: "wss://1rpc.io/ksm",
    logo: "assets/substrate/kusama.svg",
  },
  astar: {
    rpc: "wss://1rpc.io/astr",
    logo: "assets/substrate/astar.svg",
  },
};
