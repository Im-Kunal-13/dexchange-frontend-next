import React from "react"
import { useAppDispatch, useAppSelector } from "../../store/store"
import config from "../../assets/data/config.json"
import { loadTokens } from "../../api/interactions"
import { Divider, MenuItem, Select, SelectChangeEvent } from "@mui/material"

const Markets = () => {
    const dispatch = useAppDispatch()

    const provider = useAppSelector((state) => state.provider.connection)
    const chainId = useAppSelector((state) => state.provider.chainId)
    const tokenContracts = useAppSelector((state) => state.tokens.contracts)

    const marketHandler = async (e: SelectChangeEvent<`${any},${any}`>) => {
        loadTokens(provider, e.target.value.split(","), dispatch)
    }

    return (
        <div className="relative col-span-full">
            <div className="mb-[0.75em]">
                <h2 className="font-semibold">Select Market</h2>
            </div>

            {
                // @ts-ignore
                chainId && config[chainId] ? (
                    <Select
                        // @ts-ignore
                        value={
                            tokenContracts.length >= 2
                                ? `${tokenContracts[0].address},${tokenContracts[1].address}`
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
                            // @ts-ignore
                            value={`${config[chainId].BTC.address},${config[chainId].USDC.address}`}
                            defaultChecked
                        >
                            BTC / USDC
                        </MenuItem>
                        <MenuItem
                            // @ts-ignore
                            value={`${config[chainId].DAI.address},${config[chainId].USDC.address}`}
                        >
                            DAI / USDC
                        </MenuItem>
                        <MenuItem
                            // @ts-ignore
                            value={`${config[chainId].LINK.address},${config[chainId].USDC.address}`}
                        >
                            LINK / USDC
                        </MenuItem>
                    </Select>
                ) : (
                    <div>
                        <p>Not Deployed to Network</p>
                    </div>
                )
            }

            <Divider className="my-7 h-[1px]" />
        </div>
    )
}

export default Markets
