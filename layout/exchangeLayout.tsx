import { Divider } from "@mui/material"
import BalanceV2 from "../components/Dashboard/BalanceV2"
import MyOrderBookV2 from "../components/Dashboard/OrderBookV2"
import OrderBookV2 from "../components/Dashboard/MyOrderBookV2"
import OrderV2 from "../components/Dashboard/OrderV2"
import PriceChartV2 from "../components/Dashboard/PriceChartV2"

const exchangeLayout = () => {
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
                <OrderBookV2 />
            </div>
            <div
                className="col-span-3 flex flex-col overflow-clip"
                style={{ maxHeight: "calc(100vh - 92px)", minHeight: "calc(100vh - 92px)" }}
            >
                <MyOrderBookV2 />
            </div>
        </div>
    )
}

export default exchangeLayout
