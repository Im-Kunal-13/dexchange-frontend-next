import { useAppDispatch, useAppSelector } from "../../store/store"
import { loadTokens } from "../../api/interactions"
import { Divider, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { useEffect } from "react"

const localPairs = {
    "BTC-USDC": {
        baseAsset: "BTC",
        baseAssetAddress: "0x8c769d033934009fF7dB8A2976d3BdabFa3Dd833",
        baseAssetPrecision: 8,
        quoteAsset: "USDC",
        quoteAssetAddress: "0x89126812d7aa022f817465B7197dE668330712E8",
        quoteAssetPrecision: 6,
    },
    "DAI-USDC": {
        baseAsset: "DAI",
        baseAssetAddress: "0x9763f852a16534BD0C312e15b4266A1333662101",
        baseAssetPrecision: 18,
        quoteAsset: "USDC",
        quoteAssetAddress: "0x89126812d7aa022f817465B7197dE668330712E8",
        quoteAssetPrecision: 6,
    },
    "LINK-USDC": {
        baseAsset: "LINK",
        baseAssetAddress: "0x732A6F0089CFaFd91E7Ad33475A264e1393dFaD8",
        baseAssetPrecision: 18,
        quoteAsset: "USDC",
        quoteAssetAddress: "0x89126812d7aa022f817465B7197dE668330712E8",
        quoteAssetPrecision: 6,
    },
}

const Markets = () => {
    const dispatch = useAppDispatch()

    const { connection } = useAppSelector((state) => state.provider)
    const { contracts, pair } = useAppSelector((state) => state.tokens)

    const marketHandler = async (e: SelectChangeEvent<`${any},${any}`>) => {
        loadTokens(connection, e.target.value.split(","), dispatch)
    }

    return (
        <div className="relative col-span-full">
            <div className="mb-[0.75em]">
                <h2 className="font-semibold">Select Market</h2>
            </div>

            <Select
                value={
                    contracts.length >= 2
                        ? `${contracts[0].address},${contracts[1].address}`
                        : ""
                }
                variant="standard"
                name="markets"
                id="markets"
                className="bg-bgGray1 rounded overflow-hidden"
                MenuProps={{
                    classes: {
                        list: "text-white shadow",
                        paper: "rounded bg-bgGray1 mt-2 shadow",
                    },
                }}
                onChange={marketHandler}
                sx={{ color: "white" }}
                classes={{
                    select: "w-36 text-white bg-bgGray1 focus:bg-bgGray1 border-none py-[1rem] px-[1rem] font-semibold text-sm cursor-pointer relative w-[385px]",
                    icon: "text-white transition-all duration-300 relative right-2.5",
                }}
                disableUnderline={true}
            >
                <MenuItem disabled value="">
                    Select Market
                </MenuItem>

                <MenuItem
                    value={`${localPairs["BTC-USDC"].baseAssetAddress},${localPairs["BTC-USDC"].quoteAssetAddress}`}
                >
                    BTC / USDC
                </MenuItem>
                <MenuItem
                    value={`${localPairs["DAI-USDC"].baseAssetAddress},${localPairs["DAI-USDC"].quoteAssetAddress}`}
                >
                    DAI / USDC
                </MenuItem>
                <MenuItem
                    value={`${localPairs["LINK-USDC"].baseAssetAddress},${localPairs["LINK-USDC"].quoteAssetAddress}`}
                >
                    LINK / USDC
                </MenuItem>
            </Select>

            <Divider className="my-7 h-[1px]" />
        </div>
    )
}

export default Markets
