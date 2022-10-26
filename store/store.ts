import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux"
import { provider, tokens, exchange, order } from "../features/reducers"
import thunk from "redux-thunk"
import { IRootState } from "../types"

export const store = configureStore({
    reducer: {
        provider,
        tokens,
        exchange,
        order,
    },
    middleware: [thunk],
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector
