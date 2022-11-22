import { createReducer } from "@reduxjs/toolkit"
import { IExchange, IProvider, ITokens, IOrder, ITrade } from "../types"
import {
    sortByPriceAscending,
    sortByPriceDescending,
    sortByTimeStamp,
    sortByTimeStampDescending,
} from "../utility"
import { actions } from "./reducerActions"

const DEFAULT_TOKENS_STATE: ITokens = {
    loaded: false,
    contracts: [],
    symbols: ["", ""],
    balances: [],
    pair: null,
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
    balances: [],
    depositState: {
        loading: false,
        failed: false,
        success: false,
    },
    withdrawState: {
        loading: false,
        failed: false,
        success: false,
    },
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
    insertOrderState: {
        loading: false,
        success: false,
        error: false,
        status: "",
    },
}

const DEFAULT_TRADES_STATE: ITrade = {
    myTrades: [],
    allTrades: [],
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
        // CONTRACT
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
        .addCase(actions.deposit_loading, (state) => {
            state.depositState.loading = true
            state.depositState.success = false
            state.depositState.failed = false
        })
        .addCase(actions.deposit_success, (state) => {
            state.depositState.loading = false
            state.depositState.success = true
            state.depositState.failed = false
        })
        .addCase(actions.deposit_failed, (state) => {
            state.depositState.loading = false
            state.depositState.success = false
            state.depositState.failed = true
        })
        .addCase(actions.withdraw_loading, (state) => {
            state.withdrawState.loading = true
            state.withdrawState.success = false
            state.withdrawState.failed = false
        })
        .addCase(actions.withdraw_success, (state) => {
            state.withdrawState.loading = false
            state.withdrawState.success = true
            state.withdrawState.failed = false
        })
        .addCase(actions.withdraw_failed, (state) => {
            state.withdrawState.loading = false
            state.withdrawState.success = false
            state.withdrawState.failed = true
        })
})

export const order = createReducer(DEFAULT_ORDERS_STATE, (builder) => {
    builder
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

        // INSERT ORDER STATES
        .addCase(actions.insert_order_status, (state, action) => {
            state.insertOrderState.status = action.payload
        })
        .addCase(actions.insert_order_loading, (state) => {
            state.insertOrderState.loading = true
            state.insertOrderState.success = false
            state.insertOrderState.error = false
        })
        .addCase(actions.insert_order_success, (state) => {
            state.insertOrderState.loading = false
            state.insertOrderState.success = true
            state.insertOrderState.error = false
        })
        .addCase(actions.insert_order_error, (state) => {
            state.insertOrderState.loading = false
            state.insertOrderState.success = false
            state.insertOrderState.error = true
        })

        // SOCKET EVENTS
        .addCase(actions.new_order_inserted, (state, action) => {
            if (action.payload.order.side === "buy") {
                state.buyOrders = state.buyOrders
                    .concat([action.payload.order])
                    .sort(sortByTimeStamp)
                    .sort(sortByPriceDescending)
            } else if (action.payload.order.side === "sell") {
                state.sellOrders = state.sellOrders
                    .concat([action.payload.order])
                    .sort(sortByTimeStamp)
                    .sort(sortByPriceAscending)
            }

            if (action.payload.order.wallet === action.payload.account) {
                state.myOrders = state.myOrders
                    .concat([action.payload.order])
                    .sort(sortByTimeStamp)
            }
        })
        .addCase(actions.order_cancelled, (state, action) => {
            if (action.payload.order.side === "buy") {
                state.buyOrders = state.buyOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            } else if (action.payload.order.side === "sell") {
                state.sellOrders = state.sellOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }

            if (action.payload.order.wallet === action.payload.account) {
                state.myOrders = state.myOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }

            state.cancelledOrders.push(action.payload.order)
        })
        .addCase(actions.order_filled, (state, action) => {
            if (action.payload.order.side === "buy") {
                state.buyOrders = state.buyOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            } else if (action.payload.order.side === "sell") {
                state.sellOrders = state.sellOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }

            if (action.payload.order.wallet === action.payload.account) {
                state.myOrders = state.myOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }
        })
        .addCase(actions.order_partially_filled, (state, action) => {
            if (action.payload.order.side === "buy") {
                state.buyOrders.map((order) => {
                    if (order._id === action.payload.order._id) {
                        order.status = "partially-filled"
                        order.remainingQuantity =
                            action.payload.order.remainingQuantity
                    }
                })
            } else if (action.payload.order.side === "sell") {
                state.sellOrders.map((order) => {
                    if (order._id === action.payload.order._id) {
                        order.status = "partially-filled"
                        order.remainingQuantity =
                            action.payload.order.remainingQuantity
                    }
                })
            }

            if (action.payload.order.wallet === action.payload.account) {
                state.myOrders.map((order) => {
                    if (order._id === action.payload.order._id) {
                        order.status = "partially-filled"
                        order.remainingQuantity =
                            action.payload.order.remainingQuantity
                    }
                })
            }
        })
        .addCase(actions.order_partially_filled_cancelled, (state, action) => {
            if (action.payload.order.side === "buy") {
                state.buyOrders = state.buyOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            } else if (action.payload.order.side === "sell") {
                state.sellOrders = state.sellOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }

            if (action.payload.order.wallet === action.payload.account) {
                state.myOrders = state.myOrders.filter(
                    (order) => order._id !== action.payload.order._id
                )
            }

            state.cancelledOrders.push(action.payload.order)
        })
})

export const trade = createReducer(DEFAULT_TRADES_STATE, (builder) => {
    builder
        .addCase(actions.load_trades, (state, action) => {
            state.allTrades = action.payload
        })
        .addCase(actions.load_my_trades, (state, action) => {
            state.myTrades = action.payload
        })
        .addCase(actions.insert_trade, (state, action) => {
            state.allTrades = state.allTrades
                .concat([action.payload.order])
                .sort(sortByTimeStampDescending)

            if (action.payload.order.wallet === action.payload.account) {
                state.myTrades = state.myTrades
                    .concat([action.payload.order])
                    .sort(sortByTimeStampDescending)
            }
        })
})
