import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import DashboardLayout from "../../layout/dashboard"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { useAppDispatch, useAppSelector } from "../../store/store"
import { loadTokens } from "../../api/interactions"
import NorthIcon from "@mui/icons-material/North"
import Head from "next/head"

const exchange = () => {
    const dispatch = useAppDispatch()

    const { connection, chainId } = useAppSelector((state) => state.provider)
    const { pair, symbols } = useAppSelector((state) => state.tokens)

    const marketHandler = async (e: SelectChangeEvent<`${any},${any}`>) => {
        console.log(e.target.value.split("-")[0])
        loadTokens(
            connection,
            [
                pair.pairs[e.target.value].baseAssetAddress,
                pair.pairs[e.target.value].quoteAssetAddress,
            ],
            e.target.value.split("-"),
            dispatch
        )
    }

    // Metamask method for handling chain change
    const networkHandler = async (e: SelectChangeEvent<string>) => {
        if (typeof window !== "undefined") {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: e.target.value }],
            })
        }
    }

    return (
        <DashboardLayout>
            <Head>
                <title>Dexchange</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <div className="border-b border-b-white border-opacity-10 grid grid-cols-7 h-[92px]">
                <Select
                    // @ts-ignore
                    value={symbols[0] ? symbols.join("-") : ``}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll",
                    }}
                    className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] border-r border-r-white border-opacity-10 w-fit max-w-full my-auto max-h-[73px]"
                    disableUnderline={true}
                    onChange={marketHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-[190px] max-h-[300px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-3 bottom-1" />
                    )}
                >
                    {pair?.pairs &&
                        Object.keys(pair.pairs).map((key) => (
                            <MenuItem value={key} key={key}>
                                <div className="flex gap-[16px] items-center">
                                    <div className="relative">
                                        <img
                                            src={`/images/${
                                                key.split("-")[0]
                                            }.png`}
                                            className="w-[40px] min-w-[40px]"
                                            alt=""
                                        />
                                        <img
                                            src={`/images/${
                                                key.split("-")[1]
                                            }.png`}
                                            alt=""
                                            className="w-[20px] absolute -right-2 bottom-0"
                                        />
                                    </div>
                                    <div className="flex flex-col items-start min-w-[86px]">
                                        <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                            {key.split("-")[0] === "BTC"
                                                ? "Bitcoin"
                                                : key.split("-")[0]}
                                        </span>
                                        <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold">
                                            {key.split("-").join(" / ")}
                                        </span>
                                    </div>
                                </div>
                            </MenuItem>
                        ))}
                </Select>
                <div className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] flex flex-col gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                    <p className="text-[12px] leading-[1.3] font-semibold text-textGray1">
                        Last price
                    </p>
                    <p className="text-[14px] leading-[1.3] font-semibold text-textGreen1 uppercase">
                        32,000 USDC
                    </p>
                </div>
                <div className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] flex flex-col gap-1 border-r border-r-white border-opacity-10 w-full my-auto max-h-[73px]">
                    <p className="text-[12px] leading-[1.3] font-semibold text-textGray1">
                        24h change
                    </p>
                    <p className="text-[14px] leading-[1.3] font-semibold text-textGreen1 uppercase">
                        <NorthIcon className="text-base text-textGreen1" />{" "}
                        +6.67%
                    </p>
                </div>
                <Select
                    value={chainId ? `0x${chainId.toString(16)}` : `0`}
                    variant="standard"
                    classes={{
                        select: "focus:bg-transparent overflow-scroll",
                    }}
                    id="networks"
                    className="py-[18px] pl-[24px] shadow text-[14px] leading-[1.7] border-r border-r-white border-opacity-10 w-fit max-w-full my-auto max-h-[73px]"
                    disableUnderline={true}
                    onChange={networkHandler}
                    MenuProps={{
                        classes: {
                            paper: "bg-bgSidebarGray1 border border-white border-opacity-10 mt-1.5 rounded-xl w-fit max-h-[300px] overflow-y-scroll custom-scrollbar pl-2",
                        },
                    }}
                    IconComponent={() => (
                        <KeyboardArrowDownIcon className="text-white relative right-3 bottom-1" />
                    )}
                >
                    {[
                        {
                            id: 5,
                            name: "Goerli",
                            chain: "Ethereum",
                        },
                        {
                            id: 280,
                            name: "zkSync 2.0",
                            chain: "Ethereum",
                        },
                        {
                            id: 80001,
                            name: "Mumbai",
                            chain: "Polygon",
                        },
                        {
                            id: 1402,
                            name: "Hermez",
                            chain: "Polygon",
                        },
                    ].map(({ id, name, chain }) => (
                        <MenuItem value={`0x${id.toString(16)}`} key={id}>
                            <div className="flex gap-[16px] items-center">
                                <div
                                    className={
                                        "w-[40px] min-w-[40px] h-[40px] rounded-full bg-blue1 flex items-center justify-center"
                                    }
                                >
                                    <img
                                        src={`/images/0x${id.toString(16)}.png`}
                                        className={`${
                                            id === 5 && "h-5"
                                        } max-w-[20px]`}
                                        alt=""
                                    />
                                </div>

                                <div className="flex flex-col items-start min-w-[86px]">
                                    <span className="font-semibold text-[14px] text-white leading-[1.7]">
                                        {chain}
                                    </span>
                                    <span className="text-textGray1 text-[14px] leading-[1.7] font-semibold overflow-visible">
                                        {name}
                                    </span>
                                </div>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
                <div></div>
            </div>
        </DashboardLayout>
    )
}

export default exchange
