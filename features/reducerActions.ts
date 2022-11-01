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

    // exchange
    load_exchange: createAction<zksync.Contract>("exchange/exchange_loaded"),
    load_exchange_token_1: createAction<string>(
        "exchange/exchange_token_1_balance_loaded"
    ),
    load_exchange_token_2: createAction<string>(
        "exchange/exchange_token_2_balance_loaded"
    ),
    request_transfer: createAction("exchange/transfer_request"),
    success_transfer: createAction<any>("exchange/transfer_success"),
    failed_transfer: createAction("exchange/transfer_failed"),

    // order

    load_sell_orders: createAction<IGetOrder[]>("order/sell_orders_loaded"),
    load_buy_orders: createAction<IGetOrder[]>("order/buy_orders_loaded"),
    load_my_orders: createAction<IGetOrder[]>("order/my_orders_loaded"),
    insert_sell_order: createAction<IGetOrder>("order/sell_order_inserted"),
    insert_buy_order: createAction<IGetOrder>("order/buy_order_inserted"),
    load_cancelled_orders: createAction<IGetOrder[]>("order/cancelled_orders_loaded"),
    cancel_order: createAction<IGetOrder>("order/order_cancelled"),
}
