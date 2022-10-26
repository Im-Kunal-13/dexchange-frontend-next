import * as zksync from "zksync-web3"
import * as ethers from "ethers"
import axios from "axios"
import { EXCHANGE_ABI, TOKEN_ABI } from "../constants/abi"
import { v4 as uuidv4 } from "uuid"
import { actions } from "../features/reducerActions"
import { AppDispatch } from "../store/store"
import { IInsertOrder } from "../types"

export const loadProvider = (dispatch: AppDispatch) => {
    if (typeof window !== "undefined") {
        const connection = new zksync.Web3Provider(window.ethereum)
        dispatch(actions.load_provider(connection))
        return connection
    }
}

export const loadNetwork = async (provider: any, dispatch: AppDispatch) => {
    const { chainId } = await provider.getNetwork()
    dispatch(actions.load_network(chainId))
    return chainId
}

export const loadAccount = async (provider: any, dispatch: AppDispatch) => {
    if (typeof window !== "undefined") {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        const account = ethers.utils.getAddress(accounts[0])

        dispatch(actions.load_account(account))

        let balance = await provider.getBalance(account)
        balance = ethers.utils.formatEther(balance)

        dispatch(actions.load_ether_balance(balance))

        return account
    }
}

export const loadTokens = async (
    provider: any,
    addresses: string[],
    dispatch: AppDispatch
) => {
    let token, symbol

    token = new zksync.Contract(addresses[0], TOKEN_ABI, provider)
    symbol = await token.symbol()
    dispatch(actions.load_token_1({ token, symbol }))

    token = new zksync.Contract(addresses[1], TOKEN_ABI, provider)
    symbol = await token.symbol()
    dispatch(actions.load_token_2({ token, symbol }))

    return token
}

export const loadExchange = async (
    provider: any,
    address: string,
    dispatch: AppDispatch
) => {
    const exchange = new zksync.Contract(address, EXCHANGE_ABI, provider)
    dispatch(actions.load_exchange(exchange))

    return exchange
}

// export const subscribeToEvents = (exchange: any, dispatch: AppDispatch) => {
//     exchange.on(
//         "Cancel",
//         async (
//             id: any,
//             user: any,
//             tokenGet: any,
//             amountGet: any,
//             tokenGive: any,
//             amountGive: any,
//             timestamp: any,
//             event: any
//         ) => {
//             // const order = event.args;

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }

//             const blockNumber = event.blockNumber
//             const blockHash = event.blockHash
//             const transactionIndex = event.transactionIndex
//             const removed = event.removed
//             const address = event.address
//             const data = event.data
//             const topics = event.topics
//             const transactionHash = event.transactionHash
//             const logIndex = event.logIndex
//             const eventName = event.event
//             const eventSignature = event.eventSignature
//             const args = [
//                 {
//                     id: id._hex,
//                     user,
//                     tokenGet,
//                     amountGet: amountGet._hex,
//                     tokenGive,
//                     amountGive: amountGive._hex,
//                     timestamp: timestamp._hex,
//                 },
//             ]

//             const body = JSON.stringify({
//                 blockNumber,
//                 blockHash,
//                 transactionIndex,
//                 removed,
//                 address,
//                 data,
//                 topics,
//                 transactionHash,
//                 logIndex,
//                 eventName,
//                 eventSignature,
//                 args,
//             })

//             try {
//                 const res = await axios.post("/api/cancelled", body, config)

//                 dispatch(
//                     actions.order_cancel_success({
//                         order: res.data.args[0],
//                         event: res.data,
//                     })
//                 )

//                 // await axios.delete(`/api/cancelled/cancel/:${id._hex.toString()}`);
//             } catch (error) {
//                 console.error(error)
//             }
//         }
//     )

//     exchange.on(
//         "Trade",
//         async (
//             id: any,
//             user: any,
//             tokenGet: any,
//             amountGet: any,
//             tokenGive: any,
//             amountGive: any,
//             creator: any,
//             timestamp: any,
//             event: any
//         ) => {
//             // const order = event.args;

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }

//             const blockNumber = event.blockNumber
//             const blockHash = event.blockHash
//             const transactionIndex = event.transactionIndex
//             const removed = event.removed
//             const address = event.address
//             const data = event.data
//             const topics = event.topics
//             const transactionHash = event.transactionHash
//             const logIndex = event.logIndex
//             const eventName = event.event
//             const eventSignature = event.eventSignature
//             const args = [
//                 {
//                     id: id._hex,
//                     user,
//                     tokenGet,
//                     amountGet: amountGet._hex,
//                     tokenGive,
//                     amountGive: amountGive._hex,
//                     timestamp: timestamp._hex,
//                 },
//             ]

//             const body = JSON.stringify({
//                 blockNumber,
//                 blockHash,
//                 transactionIndex,
//                 removed,
//                 address,
//                 data,
//                 topics,
//                 transactionHash,
//                 logIndex,
//                 eventName,
//                 eventSignature,
//                 args,
//             })

//             try {
//                 const tradeStream = await axios.get("/api/trades")
//                 const filledOrders = tradeStream.data.map(
//                     (event: any) => event.args[0]
//                 )
//                 const index = filledOrders.findIndex(
//                     (order: any) => order.id.toString() === id._hex.toString()
//                 )
//                 let res
//                 if (index === -1) {
//                     res = await axios.post("/api/trades", body, config)
//                 }

//                 dispatch(
//                     actions.order_fill_success({
//                         // @ts-ignore
//                         order: res.data.args[0],
//                         // @ts-ignore
//                         event: res.data,
//                     })
//                 )
//             } catch (error) {
//                 console.error(error)
//             }
//         }
//     )

//     exchange.on(
//         "Deposit",
//         (token: any, user: any, amount: any, balance: any, event: any) => {
//             dispatch(actions.success_transfer(event))
//         }
//     )

//     exchange.on(
//         "Withdraw",
//         (token: any, user: any, amount: any, balance: any, event: any) => {
//             dispatch(actions.success_transfer(event))
//         }
//     )

//     exchange.on(
//         "OrderLogged",
//         async (
//             id: any,
//             user: any,
//             tokenGet: any,
//             amountGet: any,
//             tokenGive: any,
//             amountGive: any,
//             timestamp: any,
//             event: any
//         ) => {
//             // const order = event.args;

//             const config = {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//             }

//             const blockNumber = event.blockNumber
//             const blockHash = event.blockHash
//             const transactionIndex = event.transactionIndex
//             const removed = event.removed
//             const address = event.address
//             const data = event.data
//             const topics = event.topics
//             const transactionHash = event.transactionHash
//             const logIndex = event.logIndex
//             const eventName = event.event
//             const eventSignature = event.eventSignature
//             const args = [
//                 {
//                     id: id._hex,
//                     user,
//                     tokenGet,
//                     amountGet: amountGet._hex,
//                     tokenGive,
//                     amountGive: amountGive._hex,
//                     timestamp: timestamp._hex,
//                 },
//             ]

//             const body = JSON.stringify({
//                 blockNumber,
//                 blockHash,
//                 transactionIndex,
//                 removed,
//                 address,
//                 data,
//                 topics,
//                 transactionHash,
//                 logIndex,
//                 eventName,
//                 eventSignature,
//                 args,
//             })

//             try {
//                 const orderStream = await axios.get("/api/orders")
//                 const allOrders = orderStream.data.map(
//                     (event: any) => event.args[0]
//                 )
//                 const index = allOrders.findIndex(
//                     (order: any) => order.id.toString() === id._hex.toString()
//                 )
//                 let res
//                 if (index === -1) {
//                     res = await axios.post("/api/orders", body, config)
//                 }

//                 dispatch(
//                     actions.success_new_order({
//                         // @ts-ignore
//                         order: res.data.args[0],
//                         // @ts-ignore
//                         event: res.data,
//                     })
//                 )
//             } catch (error) {
//                 console.error(error)
//             }
//         }
//     )
// }

// --------------------------
// LOAD USER BALANCES (WALLET AND EXCHANGE BALANCES)

export const loadBalances = async (
    exchange: any,
    tokens: any,
    account: string,
    dispatch: AppDispatch
) => {
    let balance = ethers.utils.formatUnits(
        await tokens[0].balanceOf(account),
        18
    )
    dispatch(actions.load_token_1_balance(balance))

    balance = ethers.utils.formatUnits(
        await exchange.balanceOf(tokens[0].address, account),
        18
    )
    dispatch(actions.load_exchange_token_1(balance))

    balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18)
    dispatch(actions.load_token_2_balance(balance))

    balance = ethers.utils.formatUnits(
        await exchange.balanceOf(tokens[1].address, account),
        18
    )
    dispatch(actions.load_exchange_token_2(balance))
}

// ------------------------------------------------------------------------------
// TRANSFER TOKENS (DEPOSIT & WITHDRAWS)

export const transferTokens = async (
    provider: any,
    exchange: any,
    transferType: string,
    token: any,
    amount: number,
    dispatch: AppDispatch
) => {
    let transaction

    dispatch(actions.request_transfer())

    try {
        const signer = await provider.getSigner()
        const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18)

        if (transferType === "Deposit") {
            transaction = await token
                .connect(signer)
                .approve(exchange.address, amountToTransfer)
            await transaction.wait()
            transaction = await exchange
                .connect(signer)
                .depositToken(token.address, amountToTransfer)
        } else {
            transaction = await exchange
                .connect(signer)
                .withdrawToken(token.address, amountToTransfer)
        }

        await transaction.wait()
    } catch (error) {
        dispatch(actions.failed_transfer())
    }
}

// ORDER

export const insertOrder = async (
    provider: any,
    wallet: string,
    market: string,
    type: string,
    side: string,
    amount: string,
    price: string,
    chainId: number,
    dispatch: AppDispatch,
    setSnackbarSuccess: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
) => {
    console.log("yo")
    const domain = {
        name: "DeXchange",
        version: "1",
        chainId: 5,
    }

    const types = {
        Order: [
            { name: "nonce", type: "string" },
            { name: "wallet", type: "address" },
            { name: "market", type: "string" },
            { name: "type", type: "string" },
            { name: "side", type: "string" },
            { name: "amount", type: "uint256" },
            { name: "price", type: "uint256" },
            { name: "chainId", type: "uint256" },
        ],
    }

    const parameters = {
        chainId,
        nonce: uuidv4(),
        wallet,
        market,
        type,
        side,
        amount,
        price,
    }
    try {
        const signer = await provider.getSigner()
        const signature = await signer._signTypedData(domain, types, parameters)

        const order: IInsertOrder = {
            parameters,
            signature,
        }
        const res = await axios.post("http://localhost:5001/api/orders", order)
        dispatch(actions.insert_new_order(res.data))
        setSnackbarSuccess({open: true, message: "Your order has been placed successfully."})

        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

export const getOrders = async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get("http://localhost:5001/api/orders")
        dispatch(actions.load_all_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}
