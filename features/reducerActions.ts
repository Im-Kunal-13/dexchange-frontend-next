import { createAction } from "@reduxjs/toolkit"
import { IGetOrder } from "../types"
import * as zksync from "zksync-web3"

export const actions = {
    // provider
    load_provider: createAction<any>("provider/provider_loaded"),
    load_network: createAction<number>("provider/network_loaded"),
    load_account: createAction<string>("provider/account_loaded"),
    load_ether_balance: createAction<string>("provider/ether_balance_loaded"),

    // tokens
    load_token_1: createAction<{ symbol: string; token: any }>(
        "tokens/token_1_loaded"
    ),
    load_token_1_balance: createAction<string>("tokens/token_1_balance_loaded"),
    load_token_2: createAction<{ symbol: string; token: any }>(
        "tokens/token_2_loaded"
    ),
    load_token_2_balance: createAction<string>("tokens/token_2_balance_loaded"),
    load_token_pair: createAction<any>("tokens/token_pair_loaded"),

    // exchange
    load_exchange: createAction<zksync.Contract>("exchange/exchange_loaded"),
    load_exchange_token_1: createAction<{ deposited: string; blocked: string }>(
        "exchange/exchange_token_1_balance_loaded"
    ),
    load_exchange_token_2: createAction<{ deposited: string; blocked: string }>(
        "exchange/exchange_token_2_balance_loaded"
    ),
    // exchange -> deposit and withdraw
    deposit_success: createAction("exchange/deposit_success"),
    deposit_failed: createAction("exchange/deposit_failed"),
    deposit_loading: createAction("exchange/deposit_loading"),
    withdraw_success: createAction("exchange/withdraw_success"),
    withdraw_failed: createAction("exchange/withdraw_failed"),
    withdraw_loading: createAction("exchange/withdraw_loading"),

    // order
    load_sell_orders: createAction<IGetOrder[]>("order/sell_orders_loaded"),
    load_buy_orders: createAction<IGetOrder[]>("order/buy_orders_loaded"),
    load_my_orders: createAction<IGetOrder[]>("order/my_orders_loaded"),
    load_cancelled_orders: createAction<IGetOrder[]>(
        "order/cancelled_orders_loaded"
    ),
    cancel_order: createAction<IGetOrder>("order/order_cancelled"),
    insert_order_status: createAction<string>("trade/insert_order_status"),
    insert_order_loading: createAction("trade/insert_order_loading"),
    insert_order_success: createAction("trade/insert_order_success"),
    insert_order_error: createAction("trade/insert_order_error"),

    // trade
    load_trades: createAction<IGetOrder[]>("trade/trades_loaded"),
    load_my_trades: createAction<IGetOrder[]>("trade/my_trades_loaded"),
}
