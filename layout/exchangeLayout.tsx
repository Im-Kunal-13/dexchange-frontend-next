import { Divider } from "@mui/material"
import BalanceV2 from "../components/Dashboard/BalanceV2"
import OrderV2 from "../components/Dashboard/OrderV2"

const exchangeLayout = () => {
    return (
        <div className="grid grid-cols-7 h-[92px]">
            <div className="col-span-3">
                <div className="w-[55%] mt-[24px] mb-[250px] px-[24px] flex flex-col gap-[24px] overflow-y-scroll">
                    <OrderV2 />
                    <Divider className="bg-white bg-opacity-10" />
                    <BalanceV2 />
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default exchangeLayout
