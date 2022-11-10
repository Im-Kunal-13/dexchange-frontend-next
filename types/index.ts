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
    balances: { deposited: string; blocked: string }[]
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
    balances: string[]
    pair: any
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
    insertOrderState: {
        loading: boolean
        success: boolean
        error: boolean
        status: string
    }
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
