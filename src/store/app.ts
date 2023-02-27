import { IProvider } from "../types/index"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface AppPersistState {
    provider: IProvider
    setProvider: (provider: IProvider) => void
    reset: () => void
}
interface AppUIState {
    metamaskModalActive: boolean
    setMetamaskModalActive: (metamaskModalActive: boolean) => void
    sidebarToggleCollapse: boolean
    setSidebarToggleCollapse: (sidebarToggleCollapse: boolean) => void
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

export const useAppUiStore = create<AppUIState>()(
    devtools(
        (set) => ({
            metamaskModalActive: false,
            setMetamaskModalActive: (metamaskModalActive: boolean) =>
                set(() => ({
                    metamaskModalActive,
                })),
            sidebarToggleCollapse: true,
            setSidebarToggleCollapse: (sidebarToggleCollapse: boolean) =>
                set(() => ({
                    sidebarToggleCollapse,
                })),
            reset: () => set(() => ({})),
        }),
        {
            name: "app-ui-storage",
        }
    )
)
