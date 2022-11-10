import { useAppDispatch, useAppSelector } from "../../store/store"
import { loadTokens } from "../../api/interactions"
import { Divider, MenuItem, Select, SelectChangeEvent } from "@mui/material"

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
                <h2 className="font-semibold text-white">Select Market</h2>
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
                {pair &&
                    Object.keys(pair).map((key) => (
                        <MenuItem
                            key={key}
                            value={`${pair[key].baseAssetAddress},${pair[key].quoteAssetAddress}`}
                        >
                            {key}
                        </MenuItem>
                    ))}
            </Select>

            <Divider className="my-7 h-[1px]" />
        </div>
    )
}

export default Markets
