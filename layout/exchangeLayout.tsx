import { Divider } from "@mui/material"
import BalanceV2 from "../components/Dashboard/BalanceV2"
import OrderBookV2 from "../components/Dashboard/OrderBookV2"
import OrderV2 from "../components/Dashboard/OrderV2"
import PriceChartV2 from "../components/Dashboard/PriceChartV2"

const exchangeLayout = () => {
    return (
        <div className="grid grid-cols-7 pt-[92px]">
            <div
                className="col-span-3 flex overflow-hidden"
                style={{ maxHeight: "calc(100vh - 92px)" }}
            >
                <div className="w-[55%] pt-[24px] pb-[250px] px-[24px] flex flex-col gap-[24px] h-full overflow-y-scroll">
                    <OrderV2 />
                    <Divider className="bg-white bg-opacity-10" />
                    <BalanceV2 />
                </div>
                <div
                    className="w-[45%] flex flex-col overflow-clip"
                    style={{ maxHeight: "calc(100vh - 92px)" }}
                >
                    <OrderBookV2 />
                </div>
            </div>
            <div className="col-span-4 flex overflow-hidden">
                <PriceChartV2 />
            </div>
        </div>
    )
}

export default exchangeLayout
