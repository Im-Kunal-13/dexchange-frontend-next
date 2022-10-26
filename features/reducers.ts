import { createReducer } from "@reduxjs/toolkit"
import { IExchange, IProvider, ITokens, IGetOrder, IOrder } from "../types"
import { actions } from "./reducerActions"

const DEFAULT_TOKENS_STATE: ITokens = {
    loaded: false,
    contracts: [],
    symbols: [],
    balances: [],
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
}

const DEFAULT_PROVIDER_STATE: IProvider = {
    connection: {},
    chainId: 0,
    account: "",
    balance: "",
}

const DEFAULT_ORDER_STATE: IOrder = {
    allOrders: [],
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
            // @ts-ignore
            state.contracts = [action.payload.token]
            // @ts-ignore
            state.symbols = [action.payload.symbol]
        })
        .addCase(actions.load_token_1_balance, (state, action) => {
            state.balances = [action.payload]
        })
        .addCase(actions.load_token_2, (state, action) => {
            state.loaded = true
            state.contracts.push(action.payload.token)
            state.symbols.push(action.payload.symbol)
        })
        .addCase(actions.load_token_2_balance, (state, action) => {
            state.balances.push(action.payload)
        })
})

export const exchange = createReducer(DEFAULT_EXCHANGE_STATE, (builder) => {
    let index

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
})

export const order = createReducer(DEFAULT_ORDER_STATE, (builder) => {
    builder
        .addCase(actions.insert_new_order, (state, action) => {
            state.allOrders.push(action.payload)
        })
        .addCase(actions.load_all_orders, (state, action) => {
            state.allOrders = action.payload
        })
})
