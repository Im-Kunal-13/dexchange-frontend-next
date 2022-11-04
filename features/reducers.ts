import { createReducer } from "@reduxjs/toolkit"
import {
    IExchange,
    IProvider,
    ITokens,
    IGetOrder,
    IOrder,
    ITokenPair,
    ITrade,
} from "../types"
import { actions } from "./reducerActions"

const DEFAULT_TOKENS_STATE: ITokens = {
    loaded: false,
    contracts: [],
    symbols: ["", ""],
    balances: [],
    pair: {
        baseAsset: "",
        baseAssetAddress: "",
        baseAssetPrecision: 0,
        quoteAsset: "",
        quoteAssetAddress: "",
        quoteAssetPrecision: 0,
    },
}

const DEFAULT_EXCHANGE_STATE: IExchange = {
    loaded: false,
    contract: {},
    transaction: {
        transactionType: "",
        isPending: false,
        isSuccessful: false,
        isError: false,
    },
    allOrders: {
        loaded: false,
        data: [],
    },
    cancelledOrders: {
        loaded: false,
        data: [],
    },
    filledOrders: {
        loaded: false,
        data: [],
    },
    events: [],
    balances: [],
    transferInProgress: false,
    currentDeposit: false,
    currentWithdraw: false,
}

const DEFAULT_PROVIDER_STATE: IProvider = {
    connection: {},
    chainId: 0,
    account: "",
    balance: "",
}

const DEFAULT_ORDERS_STATE: IOrder = {
    sellOrders: [],
    buyOrders: [],
    myOrders: [],
    cancelledOrders: [],
}

const DEFAULT_TRADES_STATE: ITrade = {
    myTrades: [],
    allTrades: [] 
}

export const provider = createReducer(DEFAULT_PROVIDER_STATE, (builder) => {
    builder
        .addCase(actions.load_provider, (state, action) => {
            state.connection = action.payload
        })
        .addCase(actions.load_network, (state, action) => {
            state.chainId = action.payload
        })
        .addCase(actions.load_account, (state, action) => {
            state.account = action.payload
        })
        .addCase(actions.load_ether_balance, (state, action) => {
            state.balance = action.payload
        })
})

export const tokens = createReducer(DEFAULT_TOKENS_STATE, (builder) => {
    builder
        .addCase(actions.load_token_1, (state, action) => {
            state.loaded = true
            state.contracts = [action.payload.token]
            state.symbols[0] = action.payload.symbol
        })
        .addCase(actions.load_token_1_balance, (state, action) => {
            state.balances[0] = action.payload
        })
        .addCase(actions.load_token_2, (state, action) => {
            state.loaded = true
            state.contracts.push(action.payload.token)
            state.symbols[1] = action.payload.symbol
        })
        .addCase(actions.load_token_2_balance, (state, action) => {
            state.balances[1] = action.payload
        })
        .addCase(actions.load_token_pair, (state, action) => {
            state.pair = action.payload
        })
})

export const exchange = createReducer(DEFAULT_EXCHANGE_STATE, (builder) => {
    builder
        .addCase(actions.load_exchange, (state, action) => {
            state.loaded = true
            state.contract = action.payload
        })

        // BALANCE CASES
        .addCase(actions.load_exchange_token_1, (state, action) => {
            state.balances = [action.payload]
        })
        .addCase(actions.load_exchange_token_2, (state, action) => {
            state.balances.push(action.payload)
        })

        // TRANSFER CASES (DEPOSIT & WITHDRAWS)
        .addCase(actions.request_transfer, (state) => {
            state.transaction.transactionType = "Transfer"
            state.transaction.isPending = true
            state.transaction.isSuccessful = false
            state.transferInProgress = true
        })
        .addCase(actions.success_transfer, (state, action) => {
            state.transaction.transactionType = "Transfer"
            state.transaction.isPending = false
            state.transaction.isSuccessful = true
            state.transferInProgress = false
            state.events.push(action.payload)
        })
        .addCase(actions.failed_transfer, (state) => {
            state.transaction.transactionType = "Transfer"
            state.transaction.isPending = false
            state.transaction.isSuccessful = false
            state.transaction.isError = true
            state.transferInProgress = false
        })
        .addCase(actions.deposit_success, (state, action) => {
            state.currentDeposit = action.payload
        })
        .addCase(actions.withdraw_success, (state, action) => {
            state.currentWithdraw = action.payload
        })
})

export const order = createReducer(DEFAULT_ORDERS_STATE, (builder) => {
    builder
        .addCase(actions.insert_sell_order, (state, action) => {
            state.sellOrders.push(action.payload)
            state.myOrders.push(action.payload)
        })
        .addCase(actions.insert_buy_order, (state, action) => {
            state.buyOrders.push(action.payload)
            state.myOrders.push(action.payload)
        })
        .addCase(actions.load_buy_orders, (state, action) => {
            state.buyOrders = action.payload
        })
        .addCase(actions.load_sell_orders, (state, action) => {
            state.sellOrders = action.payload
        })
        .addCase(actions.load_my_orders, (state, action) => {
            state.myOrders = action.payload
        })
        .addCase(actions.load_cancelled_orders, (state, action) => {
            state.cancelledOrders = action.payload
        })
        .addCase(actions.cancel_order, (state, action) => {
            state.myOrders = state.myOrders.filter(
                (order) => order._id !== action.payload._id
            )
            if (action.payload.side === "sell") {
                state.sellOrders = state.sellOrders.filter(
                    (order) => order._id !== action.payload._id
                )
            } else {
                state.buyOrders = state.buyOrders.filter(
                    (order) => order._id !== action.payload._id
                )
            }

            state.cancelledOrders.push(action.payload)
        })
})

export const trade = createReducer(DEFAULT_TRADES_STATE, (builder) => {
    // builder.addCase(actions.insert_sell_order, (state, action) => {
    //     state.sellOrders.push(action.payload)
    //     state.myOrders.push(action.payload)
    // })
})
