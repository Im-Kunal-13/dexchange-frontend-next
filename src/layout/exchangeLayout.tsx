import { Divider } from "@mui/material"
import MyOrderBookV2 from "../components/Dashboard/MyOrderBookV2"
import OrderV2 from "../components/Dashboard/OrderV2"
import OrderBookV2 from "@components/Dashboard/OrderBookV2"
import { NoSsr } from "@material-ui/core"
import { UseWallet } from "@sei-js/react"
import TvChart from "@components/Dashboard/TvChart"
import { ITransaction, useTradeStore } from "@store/trades"
import * as io from "socket.io-client"
import { useEffect } from "react"

interface Props {
    seiWallet: UseWallet | null
}

const socket = io.connect(process.env.NEXT_PUBLIC_DEXCHANGE_SERVER_DEV || "")

const exchangeLayout = ({ seiWallet }: Props) => {
    const { txHistory, addTx } = useTradeStore()

    useEffect(() => {
        socket.on("new_trade_inserted", (trade: ITransaction) => {
            console.log("New trade inserted !", trade)

            console.log(txHistory)
            addTx(trade)
        })
    }, [socket])

    return (
        <div className="grid grid-cols-12 pt-[92px]">
            <div
                className="col-span-3 overflow-hidden pt-[24px] pb-[250px] px-[24px] flex flex-col gap-[24px] h-full overflow-y-scroll"
                style={{ maxHeight: "calc(100vh - 92px)" }}
            >
                <NoSsr>
                    <OrderV2 seiWallet={seiWallet} />
                </NoSsr>
                <Divider className="bg-white bg-opacity-10" />
            </div>
            <div
                className="col-span-6 flex flex-col overflow-y-scroll"
                style={{ maxHeight: "calc(100vh - 92px)" }}
            >
                <NoSsr>
                    <TvChart />
                </NoSsr>
                <MyOrderBookV2 />
            </div>
            <div
                className="col-span-3 flex flex-col overflow-clip"
                style={{
                    maxHeight: "calc(100vh - 92px)",
                    minHeight: "calc(100vh - 92px)",
                }}
            >
                <OrderBookV2 />
            </div>
        </div>
    )
}

export default exchangeLayout
