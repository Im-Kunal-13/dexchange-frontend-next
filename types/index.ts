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
    balances: string[]
    transferInProgress: boolean
}

export interface ITokens {
    loaded: boolean
    contracts: any[]
    symbols: string[]
    balances: string[]
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

// Order

export interface IOrder {
    sellOrders: IGetOrder[]
    buyOrders: IGetOrder[]
    myOrders: IGetOrder[]
    cancelledOrders: IGetOrder[]
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
