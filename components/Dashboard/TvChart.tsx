import React from "react"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"
import { useAppSelector } from "../../store/store"

const TvChart = () => {
    const { symbols } = useAppSelector((state) => state.tokens)
    return (
        <div className="w-full h-fit bg-bgSidebarGray1 min-h-[450px]">
            <AdvancedRealTimeChart
                symbol={
                        symbols[0] === "BTC"
                        ? "KUCOIN:BTCUSDC"
                        : symbols[0] === "DAI"
                        ? "PHEMEX:DAIUSDC"
                        : symbols[0] === "SYS"
                        ? "CRYPTO:SYSUSD"
                        : symbols[0] === "LINK"
                        ? "POLONIEX:LINKUSDC"
                        : "KUCOIN:BTCUSDC"
                }
                theme="dark"
                autosize={true}
            />
        </div>
    )
}

export default TvChart
