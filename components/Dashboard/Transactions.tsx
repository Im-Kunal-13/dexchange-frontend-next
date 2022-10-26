import { useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import {
    myOpenOrdersSelector,
    myFilledOrdersSelector,
} from "../../features/selectors"
import { cancelOrder } from "../../api/interactions"
import { Banner } from "./Banner"

const Transactions = () => {
    const [showMyOrders, setShowMyOrders] = useState(true)

    const provider = useAppSelector((state) => state.provider.connection)
    const exchange = useAppSelector((state) => state.exchange.contract)
    const symbols = useAppSelector((state) => state.tokens.symbols)
    const myOpenOrders = useAppSelector(myOpenOrdersSelector)
    const myFilledOrders = useAppSelector(myFilledOrdersSelector)

    const dispatch = useAppDispatch()

    const tradeRef = useRef(null)
    const orderRef = useRef<HTMLButtonElement>(null)

    const [isOrders, setIsOrders] = useState(true)

    const tabHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // @ts-ignore
        if (e.target.className !== orderRef?.current?.className) {
            // @ts-ignore
            e.target.className = "tab tab--active"
            // @ts-ignore
            orderRef.current.className = "tab"
            setShowMyOrders(false)
        } else {
            // @ts-ignore
            e.target.className = "tab tab--active"
            // @ts-ignore
            tradeRef.current.className = "tab"
            setShowMyOrders(true)
        }
    }

    const cancelHandler = (order: any) => {
        cancelOrder(provider, exchange, order, dispatch)
    }

    return (
        <div className="relative bg-black py-[0.75em] px-[1.75em] m-[0.75em] h-[215pzx] col-start-1 col-end-7 overflow-y-scroll shadow-black1">
            {showMyOrders ? (
                <div>
                    <div className="flex items-center justify-between">
                        <h2>My Orders</h2>
                        <div className="bg-bgGray1 rounded p-[0.2em]">
                            <button
                                onClick={() => {
                                    setIsOrders(true)
                                }}
                                ref={orderRef}
                                className={`${
                                    isOrders ? "bg-btnBlue1" : "bg-transparent"
                                } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => {
                                    setIsOrders(false)
                                }}
                                ref={tradeRef}
                                className={`${
                                    !isOrders ? "bg-btnBlue1" : "bg-transparent"
                                } text-white min-w-[6em] py-[0.25em] px-[0.5em] border-none rounded font-medium cursor-pointer relative`}
                            >
                                Trades
                            </button>
                        </div>
                    </div>

                    {!myOpenOrders || myOpenOrders.length === 0 ? (
                        <Banner text="No Open Orders" />
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        {symbols && symbols[0]}
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </th>
                                    <th>
                                        {symbols && symbols[0]}/
                                        {symbols && symbols[1]}
                                        <img
                                            src="/images/sort.svg"
                                            alt="Sort"
                                        />
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {myOpenOrders &&
                                    myOpenOrders.map(
                                        (order: any, index: any) => {
                                            return (
                                                <tr key={index}>
                                                    <td
                                                        style={{
                                                            color: `${order.orderTypeClass}`,
                                                        }}
                                                    >
                                                        {order.token0Amount}
                                                    </td>
                                                    <td>{order.tokenPrice}</td>
                                                    <td>
                                                        <button
                                                            className="button--sm"
                                                            onClick={() =>
                                                                cancelHandler(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div>
                    <div className="component__header flex-between">
                        <h2>My Transactions</h2>

                        <div className="tabs">
                            <button
                                onClick={tabHandler}
                                ref={orderRef}
                                className="tab tab--active"
                            >
                                Orders
                            </button>
                            <button
                                onClick={tabHandler}
                                ref={tradeRef}
                                className="tab"
                            >
                                Trades
                            </button>
                        </div>
                    </div>

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
                                    {symbols && symbols[0]}/
                                    {symbols && symbols[1]}
                                    <img src="/images/sort.svg" alt="Sort" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {myFilledOrders &&
                                myFilledOrders.map((order: any, index: any) => {
                                    return (
                                        <tr key={index}>
                                            <td>{order.formattedTimestamp}</td>
                                            <td
                                                style={{
                                                    color: `${order.orderClass}`,
                                                }}
                                            >
                                                {order.orderSign}
                                                {order.token0Amount}
                                            </td>
                                            <td>{order.tokenPrice}</td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="w-1 h-[99%] rounded-full bg-btnBlue1 absolute right-0.5 top-0" />
        </div>
    )
}

export default Transactions
