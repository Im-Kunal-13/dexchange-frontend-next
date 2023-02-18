import { Divider } from "@mui/material"
import BalanceV2 from "../components/Dashboard/BalanceV2"
import MyOrderBookV2 from "../components/Dashboard/MyOrderBookV2"
import OrderV2 from "../components/Dashboard/OrderV2"
import PriceChartV2 from "../components/Dashboard/PriceChartV2"
import { useWallet, useQueryClient, useSigningClient } from "@sei-js/react"
import {
    DirectSecp256k1HdWallet,
    DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing"
import { fromHex } from "@cosmjs/encoding"
import { useCallback, useEffect, useState } from "react"

const privKey =
    "c526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa"
const address = "sei1ecyux4pmkllnxxw0huxz7jhtptxfr7c4lwlkrs"

const exchangeLayout = () => {
    const { queryClient, isLoading } = useQueryClient(
        "https://sei-testnet-rest.brocha.in"
    )

    function withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        const timeoutPromise = new Promise<T>((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Timeout"))
            }, timeout)
        })

        return Promise.race([promise, timeoutPromise])
    }

    const [shortBookOrders, setShortBookOrders] = useState([])

    const getAccountBalance = useCallback(async () => {
        if (!isLoading) {
            const wallet = await DirectSecp256k1Wallet.fromKey(
                fromHex(privKey),
                "sei"
            )
            const [account] = await wallet.getAccounts()
            console.log(account.address)
            const accountBalance =
                await queryClient.cosmos.bank.v1beta1.allBalances({
                    address: account.address,
                })
            console.log("account Balance", accountBalance)
        }
    }, [isLoading])

    const getShorBookAllQuery = useCallback(async () => {
        if (!isLoading) {
            const query =
                await queryClient.seiprotocol.seichain.dex.shortBookAll({
                    contractAddr:
                        "sei1466nf3zuxpya8q9emxukd7vftaf6h4psr0a07srl5zw74zh84yjqpeheyc",
                    priceDenom: "UST2",
                    assetDenom: "ATOM",
                })
            console.log({ query })
            setShortBookOrders(query?.ShortBook)
        }
    }, [isLoading])

    useEffect(() => {
        getAccountBalance()
        getShorBookAllQuery()

        // withTimeout(getShorBookAllQuery(), 5000000)
        //     .then((result) => {
        //         console.log(result)
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     })
    }, [isLoading])

    return (
        <div className="grid grid-cols-12 pt-[92px]">
            <div
                className="col-span-3 overflow-hidden pt-[24px] pb-[250px] px-[24px] flex flex-col gap-[24px] h-full overflow-y-scroll"
                style={{ maxHeight: "calc(100vh - 92px)" }}
            >
                <OrderV2 />
                <Divider className="bg-white bg-opacity-10" />
                <BalanceV2 />
            </div>
            <div
                className="col-span-6 flex flex-col overflow-y-scroll"
                style={{ maxHeight: "calc(100vh - 92px)" }}
            >
                <PriceChartV2 />
                <MyOrderBookV2 shortBookOrders={shortBookOrders} />
            </div>
            <div
                className="col-span-3 flex flex-col overflow-clip"
                style={{
                    maxHeight: "calc(100vh - 92px)",
                    minHeight: "calc(100vh - 92px)",
                }}
            >
                {/* <MyOrderBookV2 shortBookOrders={shortBookOrders} /> */}
            </div>
        </div>
    )
}

export default exchangeLayout
