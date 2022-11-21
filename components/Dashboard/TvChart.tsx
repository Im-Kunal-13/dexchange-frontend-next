import React from "react"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"
import { useAppSelector } from "../../store/store"

const TvChart = () => {
    const { symbols } = useAppSelector((state) => state.tokens)
    return (
        <div className="bg-transparent my-[0.75rem] m-[0.75em] min-h-[400px] col-start-1 col-end-13 rounded overflow-hidden shadow-black1">
            <AdvancedRealTimeChart
                symbol={
                    symbols[0] === "BTC"
                        ? "KUCOIN:BTCUSDC"
                        : symbols[0] === "DAI"
                        ? "PHEMEX:DAIUSDC"
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
