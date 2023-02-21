import moment, { Moment } from "moment"
import { IProvider } from "types"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface ITransaction {
    amount: string
    price: string
    date: Moment
    txHash: string
    side: "sell" | "buy"
}

interface AppPersistState {
    provider: IProvider
    setProvider: (provider: IProvider) => void
    txHistory: ITransaction[]
    setTxHistory: (txHistory: ITransaction[]) => void
    reset: () => void
}

export const useAppPersistStore = create<AppPersistState>()(
    devtools(
        persist(
            (set) => ({
                provider: {
                    connection: null,
                    account: "",
                    balances: [],
                    chainId: "",
                },
                setProvider: (provider: IProvider) => set(() => ({ provider })),
                txHistory: [],
                setTxHistory: (txHistory: ITransaction[]) =>
                    set(() => ({ txHistory })),
                reset: () =>
                    set(() => ({
                        provider: {
                            connection: null,
                            account: "",
                            balances: [],
                            chainId: "",
                        },
                    })),
            }),
            {
                name: "app-storage",
            }
        )
    )
)
