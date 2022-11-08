import { createReducer } from "@reduxjs/toolkit"
import { IExchange, IProvider, ITokens, IOrder, ITrade } from "../types"
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
    events: [],
    balances: [],
    transferInProgress: false,
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
        .addCase(actions.update_sell_order, (state, action) => {
            let foundIndex = state.sellOrders.findIndex(
                (sellOrder) => sellOrder._id === action.payload.orderId
            )

            if (foundIndex !== -1) {
                state.sellOrders[foundIndex] = {
                    ...state.sellOrders[foundIndex],
                    updatedAt: action.payload.updatedAt,
                    remainingQuantity: (
                        Number(state.sellOrders[foundIndex].remainingQuantity) -
                        Number(action.payload.filledQuantity)
                    ).toString(),
                    status:
                        state.sellOrders[foundIndex].originalQuantity ===
                        action.payload.filledQuantity
                            ? "filled"
                            : "partially-filled",
                }
            }
        })
        .addCase(actions.update_buy_order, (state, action) => {
            console.log("Updating buy order...")
            let foundIndex = state.buyOrders.findIndex(
                (buyOrder) => buyOrder._id === action.payload.orderId
            )

            if (foundIndex !== -1) {
                state.buyOrders[foundIndex] = {
                    ...state.buyOrders[foundIndex],
                    updatedAt: action.payload.updatedAt,
                    remainingQuantity: (
                        Number(state.buyOrders[foundIndex].remainingQuantity) -
                        Number(action.payload.filledQuantity)
                    ).toString(),
                    status:
                        state.buyOrders[foundIndex].remainingQuantity ===
                        action.payload.filledQuantity
                            ? "filled"
                            : "partially-filled",
                }
            }
        })

        // .addCase(actions._order, (state, action) => {
        //     state.myOrders = state.myOrders.filter(
        //         (order) => order._id !== action.payload._id
        //     )
        //     if (action.payload.side === "sell") {
        //         state.sellOrders = state.sellOrders.filter(
        //             (order) => order._id !== action.payload._id
        //         )
        //     } else {
        //         state.buyOrders = state.buyOrders.filter(
        //             (order) => order._id !== action.payload._id
        //         )
        //     }

        //     state.cancelledOrders.push(action.payload)
        // })

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
})

export const trade = createReducer(DEFAULT_TRADES_STATE, (builder) => {
    builder
        .addCase(actions.load_trades, (state, action) => {
            state.allTrades = action.payload
        })
        .addCase(actions.load_my_trades, (state, action) => {
            state.myTrades = action.payload
        })
        .addCase(actions.insert_my_trade, (state, action) => {
            state.myTrades.push(action.payload)
        })
        .addCase(actions.insert_trade, (state, action) => {
            state.allTrades.push(action.payload)
        })
        .addCase(actions.update_trade, (state, action) => {
            action.payload.fills.forEach((fill) => {
                let foundIndex = state.allTrades.findIndex(
                    (trade) => trade._id === fill.orderId
                )
                if (foundIndex !== -1) {
                    state.allTrades[foundIndex].fills.push(
                        action.payload.fills[0]
                    )
                } else {
                    //todo -> fetch and push the order here
                }
            })
        })
})
