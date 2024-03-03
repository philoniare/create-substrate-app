interface ChainProviders {
    [key: string]: string;
}

export const CHAIN_PROVIDERS: ChainProviders = {
  default: "wss://1rpc.io/dot",
  polkadot: "wss://1rpc.io/dot",
  kusama: "wss://1rpc.io/ksm",
  astar: "wss://1rpc.io/astr",
};