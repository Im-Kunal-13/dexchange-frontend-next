import * as zksync from "zksync-web3"
import * as ethers from "ethers"
import { EXCHANGE_ABI, TOKEN_ABI } from "../constants/abi"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import { actions } from "../features/reducerActions"
import { AppDispatch } from "../store/store"
import { IDeposit, IGetOrder, IInsertOrder } from "../types"
import axiosConfig from "../config/axiosConfig"

// PROVIDER
export const loadProvider = (dispatch: AppDispatch) => {
    if (typeof window !== "undefined") {
        const connection = new zksync.Web3Provider(window.ethereum)
        dispatch(actions.load_provider(connection))
        return connection
    }
}

// NETWORK
export const loadNetwork = async (provider: any, dispatch: AppDispatch) => {
    const { chainId } = await provider.getNetwork()
    dispatch(actions.load_network(chainId))
    return chainId
}

// ACCOUNT
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

// TOKEN
export const loadTokens = async (
    provider: any,
    addresses: string[],
    symbols: string[],
    dispatch: AppDispatch
) => {
    let token

    token = new zksync.Contract(addresses[0], TOKEN_ABI, provider)
    dispatch(actions.load_token_1({ token, symbol: symbols[0] }))

    token = new zksync.Contract(addresses[1], TOKEN_ABI, provider)
    dispatch(actions.load_token_2({ token, symbol: symbols[1] }))

    return token
}

export const loadTokenPair = async (chainId: number, dispatch: AppDispatch) => {
    try {
        const res = await axiosConfig.get(`/api/pairs/${chainId}`)
        dispatch(actions.load_token_pair(res.data))
    } catch (error) {
        console.log(error)
    }
}

// CONTRACT
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

function uuidToDecimal(uuid: string) {
    return ethers.BigNumber.from(`0x${uuid.replace(/-/g, "")}`).toString()
}

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
        name: "Dexchange",
        version: "1",
        chainId,
        verifyingContract: dexchangeAddress,
    }

    const types = {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        DepositToken: [
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
        amount: ethers.utils.parseUnits(amount, precision).toString(),
    }

    const dataToSign = JSON.stringify({
        types,
        domain: domain,
        primaryType: "DepositToken",
        message: parameters,
    })

    try {
        const signer = await provider.getSigner()
        console.log("nonce => ", parameters.nonce)

        await token
            .connect(signer)
            .approve(
                dexchangeAddress,
                ethers.utils.parseUnits(amount, precision)
            )

        const signature = await provider.send("eth_signTypedData_v4", [
            userAddress,
            dataToSign,
        ])
        console.log("signature =>", signature)

        const reqBody: IDeposit = {
            parameters,
            signature,
        }

        dispatch(actions.deposit_loading())
        const res = await axiosConfig.post("/api/deposit", reqBody)

        dispatch(actions.deposit_success())

        console.log(res.data)
    } catch (error) {
        console.log(error)
        dispatch(actions.deposit_failed())
    }
}

export const withdraw = async (
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
        name: "Dexchange",
        version: "1",
        chainId,
        verifyingContract: dexchangeAddress,
    }

    const types = {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        WithdrawToken: [
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
        amount: ethers.utils.parseUnits(amount, precision).toString(),
    }

    const dataToSign = JSON.stringify({
        types,
        domain: domain,
        primaryType: "WithdrawToken",
        message: parameters,
    })

    try {
        const signature = await provider.send("eth_signTypedData_v4", [
            userAddress,
            dataToSign,
        ])

        const reqBody = {
            parameters,
            signature,
        }

        dispatch(actions.withdraw_loading())

        const res = await axiosConfig.post("/api/withdraw", reqBody)

        dispatch(actions.withdraw_success())
    } catch (error) {
        console.log(error)
        dispatch(actions.withdraw_failed())
    }
}

// BALANCES
export const loadTokenBalances = async (
    tokens: any,
    account: string,
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
    tokenPrecisions: number[],
    tokens: any,
    account: string,
    chainId: number,
    dispatch: AppDispatch
) => {
    try {
        const res = await axiosConfig.get(`/api/balances/${chainId}/${account}`)

        dispatch(
            actions.load_exchange_token_1({
                deposited: ethers.utils.formatUnits(
                    res.data?.balances[chainId][tokens[0].address].deposited,
                    tokenPrecisions[0]
                ),
                blocked: ethers.utils.formatUnits(
                    res.data?.balances[chainId][tokens[0].address].blocked,
                    tokenPrecisions[0]
                ),
            })
        )

        dispatch(
            actions.load_exchange_token_2({
                deposited: ethers.utils.formatUnits(
                    res.data?.balances[chainId][tokens[1].address].deposited,
                    tokenPrecisions[1]
                ),
                blocked: ethers.utils.formatUnits(
                    res.data?.balances[chainId][tokens[1].address].blocked,
                    tokenPrecisions[1]
                ),
            })
        )
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
    dexchangeAddress: string,
    precisions: number[],
    provider: any,
    dispatch: AppDispatch
) => {
    const domain = {
        name: "Dexchange",
        version: "1",
        chainId,
        verifyingContract: dexchangeAddress,
    }

    const types = {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        Order: [
            { name: "chainId", type: "uint256" },
            { name: "nonce", type: "string" },
            { name: "userAddress", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "market", type: "string" },
            { name: "orderType", type: "string" },
            { name: "orderSide", type: "string" },
            { name: "rate", type: "uint256" },
        ],
    }

    const parameters = {
        chainId,
        nonce: uuidv4(),
        userAddress: wallet,
        market,
        orderType: type.toLowerCase(),
        orderSide: side.toLowerCase(),
        amount: ethers.utils.parseUnits(amount, precisions[0]).toString(),
        rate: ethers.utils.parseUnits(price, precisions[1]).toString(),
    }

    const dataToSign = JSON.stringify({
        types,
        domain: domain,
        primaryType: "Order",
        message: parameters,
    })

    try {
        const signature = await provider.send("eth_signTypedData_v4", [
            wallet,
            dataToSign,
        ])

        const order: IInsertOrder = {
            parameters,
            signature,
        }

        dispatch(actions.insert_order_loading())

        await axiosConfig.post("/api/orders", order)

        dispatch(actions.insert_order_success())
    } catch (error) {
        dispatch(actions.insert_order_error())
        console.log("Insert order error: " + error)
    }
}

export const getBuyOrders = async (chainId: number, dispatch: AppDispatch) => {
    try {
        const res = await axiosConfig.get(
            `/api/orders/buy?type=limit&chainId=${chainId}`,
            {
                params: {
                    status: ["open", "partially-filled"],
                },
            }
        )
        dispatch(actions.load_buy_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getSellOrders = async (chainId: number, dispatch: AppDispatch) => {
    try {
        const res = await axiosConfig.get(
            `/api/orders/sell?type=limit&chainId=${chainId}`,
            {
                params: {
                    status: ["open", "partially-filled"],
                },
            }
        )
        dispatch(actions.load_sell_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getMyOrders = async (
    chainId: number,
    wallet: string,
    dispatch: AppDispatch
) => {
    try {
        const res = await axiosConfig.get(
            `/api/orders/?chainId=${chainId}&wallet=${wallet}`
        )
        dispatch(actions.load_my_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const getCancelledOrders = async (
    chainId: number,
    wallet: string,
    dispatch: AppDispatch
) => {
    try {
        const res = await axiosConfig.get(
            `/api/cancelled/${wallet}&chainId=${chainId}`
        )
        dispatch(actions.load_cancelled_orders(res.data))
    } catch (error) {
        console.log(error)
    }
}

export const cancelOrder = async (
    order: IGetOrder,
    setSnackbarInfo: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            message: string
        }>
    >
) => {
    try {
        await axiosConfig.post(`/api/cancelled/${order._id.toString()}`)

        setSnackbarInfo({
            open: true,
            message: "Your order has been cancelled !",
        })
    } catch (error) {
        console.log(error)
    }
}

// TRADES

export const loadTrades = async (
    chainId: number,
    market: string,
    dispatch: AppDispatch,
    wallet: string = ""
) => {
    try {
        const res = await axiosConfig.get(
            `/api/trades/${chainId}/${market}?wallet=${wallet}`
        )

        if (wallet) {
            dispatch(actions.load_my_trades(res.data))
        } else {
            dispatch(actions.load_trades(res.data))
        }
    } catch (error) {
        console.log(error)
    }
}
