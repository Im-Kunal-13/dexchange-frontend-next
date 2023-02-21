import { BigNumber } from "ethers"

export interface IExchange {
    loaded: boolean
    contract: any
    transaction: {
        transactionType: string
        isPending: boolean
        isSuccessful: boolean
        isError: boolean
    }
    allOrders: {
        loaded: boolean
        data: IOrder[]
    }
    cancelledOrders: {
        loaded: boolean
        data: IOrder[]
    }
    filledOrders: {
        loaded: boolean
        data: IOrder[]
    }
    balances: { deposited: BigNumber; blocked: BigNumber }[]
    depositState: {
        loading: boolean
        failed: boolean
        success: boolean
    }
    withdrawState: {
        loading: boolean
        failed: boolean
        success: boolean
    }
}

export interface ITokens {
    loaded: boolean
    contracts: any[]
    symbols: string[]
    balances: BigNumber[]
    pair: any
}

export interface IProvider {
    connection: any
    chainId: string
    account: string
    balances: {
        denom: string
        amount: string
    }[]
}

export interface IRootState {
    provider: IProvider
    tokens: ITokens
    exchange: IExchange
    order: IOrder
    trade: ITrade
}

// Balance
export interface IDeposit {
    parameters: {
        chainId: number
        nonce: string
        userAddress: string
        token: string
        amount: string
    }
    signature: string
}

// Order

export interface IOrder {
    sellOrders: IGetOrder[]
    buyOrders: IGetOrder[]
    myOrders: IGetOrder[]
    cancelledOrders: IGetOrder[]
}

export interface ITrade {
    myTrades: IGetOrder[]
    allTrades: IGetOrder[]
}

export interface IInsertOrder {
    parameters: {
        chainId: number
        nonce: string
        userAddress: string
        market: string
        orderType: string
        orderSide: string
        amount: string
        rate: string
    }
    signature: string
}

export interface IGetOrder {
    _id: string
    chainId: number
    nonce: string
    wallet: string
    market: string
    type: string
    side: string
    originalQuantity: string
    remainingQuantity: string
    price: string
    status: string
    signature: string
    createdAt: string
    updatedAt: string
    __v: number
    fills: IOrderFill[]
}

export interface IOrderFill {
    orderId: string
    filledQuantity: string
    price: string
    createdAt: string
    updatedAt: string
}

export type ChainConfig = "testnet" | "devnet" | "custom"

export interface IBookOrder {
    entry: {
        allocations: {
            account: string
            orderId: string
            quantity: string
        }[]
        assetDemon: string
        price: string
        priceDenom: string
        quantity: string
    }
    price: string
    side: string
}
