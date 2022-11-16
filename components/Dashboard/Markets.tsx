import { useAppDispatch, useAppSelector } from "../../store/store"
import { loadTokens } from "../../api/interactions"
import { Divider, MenuItem, Select, SelectChangeEvent } from "@mui/material"

const Markets = () => {
    const dispatch = useAppDispatch()

    const { connection } = useAppSelector((state) => state.provider)
    const { contracts, pair, symbols } = useAppSelector((state) => state.tokens)

    const marketHandler = async (e: SelectChangeEvent<`${any},${any}`>) => {
        console.log(e.target.value.split("-")[0])
        loadTokens(
            connection,
            [
                pair.pairs[e.target.value].baseAssetAddress,
                pair.pairs[e.target.value].baseAssetAddress,
            ],
            e.target.value.split("-"),
            dispatch
        )
    }

    return (
        <div className="relative col-span-full">
            <div className="mb-[0.75em]">
                <h2 className="font-semibold text-white">Select Market</h2>
            </div>

            <Select
                // @ts-ignore
                value={symbols[0] ? symbols.join("-") : ``}
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
                {pair?.pairs &&
                    Object.keys(pair.pairs).map((key) => (
                        <MenuItem key={key} value={key}>
                            {key}
                        </MenuItem>
                    ))}
            </Select>

            <Divider className="my-7 h-[1px]" />
        </div>
    )
}

export default Markets
