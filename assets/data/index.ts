import config from "./config.json"

export const CONFIG = JSON.parse(`{
    "280": {
      "DAI": {
        "address": "0xaB334Ad47ECa0b6680358B27fFF99D28d12a01Fb"
      },
      "LINK": {
        "address": "0x4ed1e1405A5714791D4dA9607358d17dBD6E60fb"
      },
      "BTC": {
        "address": "0x9763f852a16534BD0C312e15b4266A1333662101"
      },
      "USDT": {
        "address": ""
      },
      "USDC": {
        "address": "0x732A6F0089CFaFd91E7Ad33475A264e1393dFaD8"
      },
      "deXchange": {
        "address": "0x7710b652E8b746cAAC3A69CA2655Ab1df7429f9f"
      },
      "explorerURL": "https://explorer.zksync.io"
    },
    "5": {
      "DAI": {
        "address": "0xC6b08149E9286331726587e5359F24F325adfe5D"
      },
      "LINK": {
        "address": "0x451015206C295EDdA13f13aF279a63783dE1Ee13"
      },
      "BTC": {
        "address": "0x2564f26c1BB33192bf77204AFdDa6bCfc7E22479"
      },
      "USDT": {
        "address": "0x3DcBa6FeEdA5aa38D6C0464221FBe3aFBDC2a338"
      },
      "USDC": {
        "address": "0xa0c11ffD4865de5CE8fFB1a6a87782efF0630915"
      },
      "deXchange": {
        "address": "0x5fa1258bA742f87a7FCF4581Ba9c4437acEc8Fa0"
      },
      "explorerURL": "https://goerli.etherscan.io/"
    },
    "42": {
      "explorerURL": "https://kovan.etherscan.io/"
    },
    "80001": {
      "DAI": {
        "address": "0x06229Df4604032D12191321A67DA23A8eE2eA689"
      },
      "LINK": {
        "address": "0x461F463DFd38C4CeA553e43C5ab62e20A453C364"
      },
      "BTC": {
        "address": "0x886f3d8cA4b756F4b7b5b6E8CFcbba712A1219ae"
      },
      "USDT": {
        "address": "0x04b20937E028Ceb7A0Bf96451FaA53360771C9E6"
      },
      "USDC": {
        "address": "0xCb4CF1F062A5212eaBee32EA186ec2f2B7355003"
      },
      "deXchange": {
        "address": "0xB4EbA63EE52778Fb24095b68A1934239a62578B8"
      },
      "explorerURL": "https://mumbai.polygonscan.com/"
    }
  }`)
export { default as priceChartData } from "./priceChartData"
