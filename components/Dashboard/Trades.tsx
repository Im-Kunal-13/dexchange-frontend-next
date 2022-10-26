import { useAppSelector } from "../../store/store"
import { filledOrdersSelector } from "../../features/selectors"
import { Banner } from "./Banner"

const Trades = () => {
    const symbols = useAppSelector((state) => state.tokens.symbols)
    const filledOrders = useAppSelector(filledOrdersSelector)

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] h-[215px] col-start-7 col-end-13  overflow-y-scroll shadow-black1">
            <div className="flex items-center justify-between">
                <h2>Trades</h2>
            </div>

            {!filledOrders || filledOrders.length === 0 ? (
                <Banner text="No Transactions" />
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>
                                Time
                                <img src="/images/sort.svg" alt="Sort" />
                            </th>
                            <th>
                                {symbols && symbols[0]}
                                <img src="/images/sort.svg" alt="Sort" />
                            </th>
                            <th>
                                {symbols && symbols[0]}/{symbols && symbols[1]}
                                <img src="/images/sort.svg" alt="Sort" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* MAPPING OF ORDERS... */}

                        {filledOrders &&
                            filledOrders.map((order: any, index: any) => {
                                return (
                                    <tr key={index}>
                                        <td>{order.formattedTimestamp}</td>
                                        <td
                                            style={{
                                                color: `${order.tokenPriceClass}`,
                                            }}
                                        >
                                            {order.token0Amount}
                                        </td>
                                        <td>{order.tokenPrice}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            )}
              <div className="w-1 h-[99%] rounded-full bg-btnBlue1 absolute right-0.5 top-0" />
        </div>
    )
}

export default Trades
