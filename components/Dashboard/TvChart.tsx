import React, { useEffect, useState } from "react"
// import dynamic from "next/dynamic"
// const AdvancedRealTimeChart = dynamic(
//     () => import("react-ts-tradingview-widgets").then((w) => w.SymbolOverview),
//     {
//         ssr: false,
//     }
// )
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"

const TvChart = () => {
    return (
        <div className="bg-transparent my-[0.75rem] m-[0.75em] min-h-[400px] col-start-1 col-end-13 rounded overflow-hidden shadow-black1">
            <AdvancedRealTimeChart
                symbol="BINANCE:ETHUSD"
                theme="dark"
                autosize={true}
            />
        </div>
    )
}

export default TvChart
