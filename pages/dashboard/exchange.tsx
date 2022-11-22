import { MenuItem, Select } from "@mui/material"
import React, { useState } from "react"
import DashboardLayout from "../../layout/dashboard"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

const exchange = () => {
    const [pair, setPair] = useState("BTC-USDC")

    return (
        <DashboardLayout>
            <div className="border-b border-b-white border-opacity-10 flex items-center">
                <Select
                    value={pair}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll",
                    }}
                    className="py-[18px] px-[24px] shadow text-[14px] leading-[1.7]"
                    disableUnderline={true}
                    onChange={(event) => {
                        setPair(event.target.value)
                    }}
                    MenuProps={{ classes: { paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-[190px] max-h-[300px] overflow-scroll" } }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-3" />
                    )}
                >
                    {[
                        { pair: "BTC-USDC", label: "Bitcoin" },
                        { pair: "DAI-USDC", label: "Dai" },
                        { pair: "LINK-USDC", label: "Link" },
                        { pair: "BTC-USDC", label: "Bitcoin" },
                        { pair: "DAI-USDC", label: "Dai" },
                        { pair: "LINK-USDC", label: "Link" },
                        { pair: "BTC-USDC", label: "Bitcoin" },
                        { pair: "DAI-USDC", label: "Dai" },
                        { pair: "LINK-USDC", label: "Link" },
                        { pair: "BTC-USDC", label: "Bitcoin" },
                        { pair: "DAI-USDC", label: "Dai" },
                        { pair: "LINK-USDC", label: "Link" },
                    ].map((item, index) => (
                        <MenuItem value={index} key={item.pair}>
                            <div className="flex gap-[16px] items-center">
                                <div className="relative">
                                    <img
                                        src={`/images/${
                                            item.pair.split("-")[0]
                                        }.png`}
                                        className="w-[40px]"
                                        alt=""
                                    />
                                    <img
                                        src={`/images/${
                                            item.pair.split("-")[1]
                                        }.png`}
                                        alt=""
                                        className="w-[20px] absolute -right-2 bottom-0"
                                    />
                                </div>
                                <div className="flex flex-col items-start min-w-[86px]">
                                    <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                        {item.label}
                                    </span>
                                    <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold">
                                        {item.pair.split("-").join(" / ")}
                                    </span>
                                </div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
                <div className="max-h-[100px] overflow-scroll bg-white">
                    <div className="h-[1000px]" >dfdf</div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default exchange
