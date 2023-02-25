import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets"

const TvChart = () => {
    return (
        <div className="w-full h-fit bg-bgSidebarGray1 min-h-[460px]">
            <AdvancedRealTimeChart
                symbol={"KUCOIN:BTCUSDC"}
                theme="dark"
                autosize={true}
            />
        </div>
    )
}

export default TvChart
