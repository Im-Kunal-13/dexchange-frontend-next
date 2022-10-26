import React, { useEffect, useState } from "react"
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"

const TvChart = () => {
    const [windowDefined, setWindowDefined] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowDefined(true)
        }
    }, [])

    return (
        <div className="bg-transparent my-[0.75rem] m-[0.75em] min-h-[400px] col-start-1 col-end-13 rounded overflow-hidden shadow-black1">
            {windowDefined && (
                <AdvancedRealTimeChart
                    symbol="BINANCE:BTCUSD"
                    theme="dark"
                    autosize={true}
                />
            )}
        </div>
    )
}

export default TvChart
