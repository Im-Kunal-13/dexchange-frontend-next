import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface ITransaction {
    amount: string
    price: string
    date: string
    txHash: string
    side: "sell" | "buy"
    address: string
}

interface ITradesState {
    txHistory: ITransaction[]
    setTxHistory: (txHistory: ITransaction[]) => void
    addTx: (tx: ITransaction) => void
    reset: () => void
}

export const useTradeStore = create<ITradesState>()(
    devtools(
        (set) => ({
            txHistory: [],
            setTxHistory: (txHistory: ITransaction[]) =>
                set(() => ({ txHistory })),
            addTx: (tx: ITransaction) =>
                set((state) => {
                    const txs = state?.txHistory
                    const updated_txs = txs.concat([tx])
                    return {
                        txHistory: updated_txs,
                    }
                }),
            reset: () => set(() => ({ txHistory: [] })),
        }),
        {
            name: "trade-storage",
        }
    )
)
