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
    events: any[]
    balances: { deposited: string; blocked: string }[]
    transferInProgress: boolean
    currentDeposit: boolean
    currentWithdraw: boolean
}

export interface ITokens {
    loaded: boolean
    contracts: any[]
    symbols: string[]
    balances: string[]
    pair: ITokenPair
}

export interface ITokenPair {
    baseAsset: string
    baseAssetAddress: string
    baseAssetPrecision: number
    quoteAsset: string
    quoteAssetAddress: string
    quoteAssetPrecision: number
}

export interface IProvider {
    connection: any
    chainId: number
    account: string
    balance: string
}

export interface IRootState {
    provider: IProvider
    tokens: ITokens
    exchange: IExchange
    order: IOrder
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
        wallet: string
        market: string
        type: string
        side: string
        amount: string
        price: string
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
    __v: string
}
