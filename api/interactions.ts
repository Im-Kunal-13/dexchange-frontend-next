import * as zksync from "zksync-web3"
import * as ethers from "ethers"
import axios from "axios"
import { EXCHANGE_ABI, TOKEN_ABI } from "../constants/abi"
import { v4 as uuidv4 } from "uuid"
import { actions } from "../features/reducerActions"
import { AppDispatch } from "../store/store"
import { IDeposit, IGetOrder, IInsertOrder } from "../types"

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

export const loadTokenPair = async (pair: string, dispatch: AppDispatch) => {
    const res = await axios.get(`http://localhost:5001/api/pairs`)
    dispatch(actions.load_token_pair(res.data.pairs[pair]))
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

// EXCHANGE DEPOSIT AND WITHDRAW

export const deposit = async (
    chainId: number,
    userAddress: string,
    token: any,
    amount: string,
    dexchangeAddress: string,
    precision: number,
    provider: any,
    dispatch: AppDispatch
) => {
    const domain = {
        name: "DeXchange",
        version: "1",
        chainId,
    }

    const types = {
        Deposit: [
            { name: "chainId", type: "uint256" },
            { name: "nonce", type: "string" },
            { name: "userAddress", type: "address" },
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" },
        ],
    }

    const parameters = {
        chainId,
        nonce: uuidv4(),
        userAddress,
        token: token.address,
        amount: ethers.utils.parseUnits(amount, precision),
    }

    try {
        const signer = await provider.getSigner()

        await token
            .connect(signer)
            .approve(dexchangeAddress, ethers.utils.parseUnits(amount, 8))

        const signature = await signer._signTypedData(domain, types, parameters)

        const reqBody: IDeposit = {
            parameters: { ...parameters, amount: parameters.amount.toString() },
            signature,
        }

        const res = await axios.post(
            "http://localhost:5001/api/deposit",
            reqBody
        )

        dispatch(actions.deposit_success(true))

        setTimeout(() => {
            dispatch(actions.deposit_success(false))
        }, 2000)
        console.log("Deposit Done!")

        console.log(res.data)
    } catch (error) {
        console.log(error)
    }
}

export const withdraw = async (
    chainId: number,
    userAddress: string,
    token: string,
    amount: string,
    precision: number,
    provider: any,
    dispatch: AppDispatch
) => {
    const domain = {
        name: "DeXchange",
        version: "1",
        chainId,
    }

    const types = {
        Deposit: [
            { name: "chainId", type: "uint256" },
            { name: "nonce", type: "string" },
            { name: "userAddress", type: "address" },
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" },
        ],
    }

    const parameters = {
        chainId,
        nonce: uuidv4(),
        userAddress,
        token,
        amount: ethers.utils.parseUnits(amount, precision),
    }

    try {
        const signer = await provider.getSigner()
        const signature = await signer._signTypedData(domain, types, parameters)

        const reqBody = {
            parameters: { ...parameters, amount: parameters.amount.toString() },
            signature,
        }

        const res = await axios.post(
            "http://localhost:5001/api/withdraw",
            reqBody
        )

        console.log(res.data)

        dispatch(actions.withdraw_success(true))

        setTimeout(() => {
            dispatch(actions.withdraw_success(false))
        }, 2000)
    } catch (error) {
        console.log(error)
    }
}

// --------------------------
// LOAD USER BALANCES (WALLET AND EXCHANGE BALANCES)

export const loadTokenBalances = async (
    tokens: any,
    account: string,
    chainId: number,
    precisions: number[],
    dispatch: AppDispatch
) => {
    let balance = ethers.utils.formatUnits(
        await tokens[0].balanceOf(account),
        precisions[0]
    )
    dispatch(actions.load_token_1_balance(balance))

    balance = ethers.utils.formatUnits(
        await tokens[1].balanceOf(account),
        precisions[1]
    )
    dispatch(actions.load_token_2_balance(balance))
}

export const loadExchangeBalances = async (
    tokens: any,
    account: string,
    chainId: number,
    dispatch: AppDispatch
) => {
    const res = await axios.get(
        `http://localhost:5001/api/balances/${chainId}/${account}`
    )

    dispatch(
        actions.load_exchange_token_1(
            res.data?.balances[chainId][tokens[0].address]
        )
    )

    dispatch(
        actions.load_exchange_token_2(
            res.data?.balances[chainId][tokens[1].address]
        )
    )
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

export const getAssetBalance = async (
    wallet: string,
    asset: string,
    dispatch: AppDispatch
) => {
    try {
        const res = await axios.get(
            `http://localhost:5001/api/balances?wallet=${wallet}&asset=${asset}`
        )
        console.log(res.data)
        // dispatch(actions.load_my_orders(res.data)) //todo -> dispatch my balance load here
    } catch (error) {
        console.log(error)
    }
}

// ORDER

export const insertOrder = async (
    wallet: string,
    market: string,
    type: string,
    side: string,
    amount: string,
    price: string,
    chainId: number,
    precisions: number[],
    provider: any,
    dispatch: AppDispatch,
    setSnackbarSuccess: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
) => {
    const domain = {
        name: "DeXchange",
        version: "1",
        chainId,
    }

    const types = {
        Order: [
            { name: "chainId", type: "uint256" },
            { name: "nonce", type: "string" },
            { name: "wallet", type: "address" },
            { name: "market", type: "string" },
            { name: "type", type: "string" },
            { name: "side", type: "string" },
            { name: "amount", type: "uint256" },
            { name: "price", type: type === "limit" ? "uint256" : "string" },
        ],
    }

    const parameters = {
        chainId,
        nonce: uuidv4(),
        wallet,
        market,
        type: type.toLowerCase(),
        side: side.toLowerCase(),
        amount: ethers.utils.parseUnits(amount, precisions[0]),
        price:
            type === "limit"
                ? ethers.utils.parseUnits(price, precisions[1])
                : price,
    }

    try {
        const signer = await provider.getSigner()
        const signature = await signer._signTypedData(domain, types, parameters)

        const order: IInsertOrder = {
            parameters: {
                ...parameters,
                amount: parameters.amount.toString(),
                price: parameters.price.toString(),
            },
            signature,
        }
        const res = await axios.post("http://localhost:5001/api/orders", order)
        if (side.toLowerCase() === "sell") {
            dispatch(actions.insert_sell_order(res.data))
        } else {
            dispatch(actions.insert_buy_order(res.data))
        }
        setSnackbarSuccess({
            open: true,
            message: "Your order has been placed successfully.",
        })
    } catch (error) {
        console.log(error)
    }
}

export const getBuyOrders = async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get(
            "http://localhost:5001/api/orders?side=buy&type=limit"
        )
        dispatch(actions.load_buy_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getSellOrders = async (dispatch: AppDispatch) => {
    try {
        const res = await axios.get(
            "http://localhost:5001/api/orders?side=sell&type=limit"
        )
        dispatch(actions.load_sell_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getMyOrders = async (wallet: string, dispatch: AppDispatch) => {
    try {
        const res = await axios.get(
            `http://localhost:5001/api/orders?type=limit&status=open&wallet=${wallet}`
        )
        dispatch(actions.load_my_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getCancelledOrders = async (
    wallet: string,
    dispatch: AppDispatch
) => {
    try {
        const res = await axios.get(
            `http://localhost:5001/api/cancelled/${wallet}`
        )
        dispatch(actions.load_cancelled_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const cancelOrder = async (
    order: IGetOrder,
    dispatch: AppDispatch,
    setSnackbarInfo: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
) => {
    try {
        console.log(order._id)
        await axios.post(
            `http://localhost:5001/api/cancelled/${order._id.toString()}`
        )

        dispatch(actions.cancel_order(order))

        setSnackbarInfo({
            open: true,
            message: "Your order has been cancelled !",
        })
    } catch (error) {
        console.log(error)
    }
}

export const getTrades = async (wallet: string = "", dispatch: AppDispatch) => {
    try {
        const res = await axios.get(
            `http://localhost:5001/api/trades/${wallet}`
        )

        // if (wallet) {
        //     dispatch(actions.load_trades(res.data))
        // } else {
        //     dispatch(actions.load_my_trades(res.data))
        // }
    } catch (error) {
        console.log(error)
    }
}
