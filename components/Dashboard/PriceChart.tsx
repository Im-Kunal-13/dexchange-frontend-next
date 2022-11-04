import { useAppSelector } from "../../store/store"

import Chart from "react-apexcharts"

import { priceChartData } from "../../assets/data/index"

import { priceChartSelector } from "../../features/selectors"
import { Banner } from "./Banner"

const PriceChart = () => {
    const account = useAppSelector((state) => state.provider.account)
    const symbols = useAppSelector((state) => state.tokens.symbols)
    const priceChart = useAppSelector(priceChartSelector)

    return (
        <></>
        // <div className="component exchange__chart">
        //     <div className="component__header flex-between">
        //         <div className="flex">
        //             <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>

        //             {priceChart && (
        //                 <div className="flex">
        //                     {priceChart.lastPriceChange === "+" ? (
        //                         <img
        //                             src="/images/down-arrow.svg"
        //                             alt="Arrow up"
        //                         />
        //                     ) : (
        //                         <img
        //                             src="images/up-arrow.svg"
        //                             alt="Arrow down"
        //                         />
        //                     )}

        //                     <span className="up">{priceChart.lastPrice}</span>
        //                 </div>
        //             )}
        //         </div>
        //     </div>

        //     {!account ? (
        //         <Banner text={"Please connect with Metamask"} />
        //     ) : (
        //         <Chart
        //             type="candlestick"
        //             options={priceChartData.options}
        //             series={
        //                 priceChart
        //                     ? priceChart.series
        //                     : priceChartData.defaultSeries
        //             }
        //             width="100%"
        //             height="100%"
        //         />
        //     )}
        // </div>
    )
}

export default PriceChart
