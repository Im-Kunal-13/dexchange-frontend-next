import React, { useMemo, useState } from "react"
import { useRouter } from "next/router"
import classNames from "classnames"
import Link from "next/link"
import { menuItems } from "../../../assets/links/index"
import { useAppStateContext } from "../../../context/contextProvider"
import { Divider } from "@mui/material"
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft"
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt"
import WbIncandescentOutlinedIcon from "@mui/icons-material/WbIncandescentOutlined"

export const Sidebar = () => {
    const router = useRouter()

    const [collapseIconActive, setCollapseIconActive] = useState(false)

    // @ts-ignore
    const { sidebarToggleCollapse, setSidebarToggleCollapse } =
        useAppStateContext()

    const activeMenu: any = useMemo(
        () => menuItems.find((menu) => menu.link === router.pathname),
        [router.pathname]
    )

    const wrapperClasses = classNames(
        "h-screen pt-1 bg-bgSidebarGray1 border-r border-r-white border-opacity-10 max-h-screen flex justify-between flex-col transition-all duration-300 absolute left-0 z-10",
        {
            "w-80": !sidebarToggleCollapse,
            "w-24": sidebarToggleCollapse,
            absolute: false,
        }
    )

    const getNavItemClasses = (menu: {
        id: number
        label: string
        link: string
    }) => {
        return classNames(
            "flex items-center cursor-pointer overflow-hidden whitespace-nowrap transition-all duration-300 rounded my-1 relative",
            {
                "bg-lightBlue bg-opacity-80 hover:bg-lightBlue hover:bg-opacity-80":
                    activeMenu.id === menu.id,
                "hover:bg-lightBlue hover:bg-opacity-25":
                    activeMenu.id !== menu.id,
            }
        )
    }

    const collapseIconClasses = classNames(
        "bg-white bg-opacity-10 absolute w-11 h-11 -right-5 top-[65.5px] rounded-full hover:scale-105 transition-all duration-300",
        {
            "rotate-180": sidebarToggleCollapse,
            "opacity-100": collapseIconActive,
            "opacity-0": !collapseIconActive,
        }
    )

    const getNavItemLinkClasses = (menu: {
        id: number
        label: string
        link: string
    }) =>
        classNames(
            "flex py-4 px-3 gap-3 items-center h-[56px] transition-all duration-300 text-white",
            {
                "w-60": !sidebarToggleCollapse,
                "w-12": sidebarToggleCollapse,
                "text-textGray1 hover:text-white hover:text-opacity-100 hover:bg-white hover:bg-opacity-10":
                    menu.link !== router.pathname,
                "bg-gradient1": menu.link === router.pathname,
            }
        )

    const getNavItemIndicatorCLasses = (menu: {
        id: number
        label: string
        link: string
    }) =>
        classNames(
            "absolute h-full bg-white bg-opacity-80 transition-all duration-300 w-1",
            {
                "opacity-100": menu.link === router.pathname,
                "opacity-0": menu.link !== router.pathname,
            }
        )

    return (
        <div
            className={wrapperClasses}
            id="sidebar"
            onMouseEnter={() => setCollapseIconActive(true)}
            onMouseLeave={() => setCollapseIconActive(false)}
        >
            <div className="flex flex-col relative px-5">
                <div className={`w-full overflow-hidden`}>
                    <img
                        src="/images/dexchange_logo7.png"
                        alt="dexchange logo"
                        className="mt-10 mb-10 min-w-[240px] w-[240px] relative left-1"
                    />
                </div>
                <Divider className="bg-white bg-opacity-25 h-[0.5px] mb-[14px]" />
                <button
                    className={collapseIconClasses}
                    onClick={() => {
                        setSidebarToggleCollapse(!sidebarToggleCollapse)
                    }}
                >
                    <KeyboardDoubleArrowLeftIcon className="text-textGray1 m-auto" />
                </button>

                <div className="flex flex-col items-start">
                    {menuItems.map((menu) => {
                        return (
                            <div
                                key={menu.id}
                                className={getNavItemClasses(menu)}
                            >
                                <div
                                    className={classNames(
                                        getNavItemIndicatorCLasses(menu)
                                    )}
                                />
                                <Link href={menu.link}>
                                    <a className={getNavItemLinkClasses(menu)}>
                                        {menu.link === router.pathname ? (
                                            <div className="relative">
                                                {menu.label ===
                                                    "Notifications" && (
                                                    <span
                                                        className={`absolute rounded-full w-2.5 h-2.5 right-0.5 inline-block bg-red1`}
                                                    />
                                                )}
                                                <menu.ActiveIcon className="text-[24px]" />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {menu.label ===
                                                    "Notifications" && (
                                                    <span
                                                        className={`absolute rounded-full w-2 h-2 right-[3px] top-[4.5px] inline-block bg-red1 bg-opacity-90`}
                                                    />
                                                )}
                                                <menu.Icon className="text-[24px]" />
                                            </div>
                                        )}

                                        <span
                                            className={`text-base font-semibold `}
                                        >
                                            {menu.label}
                                            {menu.label === "Notifications" && (
                                                <span
                                                    className={`ml-5 rounded-full px-2.5 py-1 text-xs text-white bg-red1`}
                                                >
                                                    99+
                                                </span>
                                            )}
                                            {menu.label === "Settings" && (
                                                <span
                                                    className={`ml-5 rounded-full w-2.5 h-2.5 inline-block text-xs text-white bg-purple1`}
                                                />
                                            )}
                                        </span>
                                    </a>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="">
                <div className="px-5">
                    <Divider className="bg-white bg-opacity-25 h-[.5px] mb-[20px]" />
                </div>

                <div
                    className={`flex items-center gap-3 px-8 overflow-hidden ${
                        sidebarToggleCollapse ? "w-12" : "w-60"
                    } transition-all duration-300`}
                >
                    <SignalCellularAltIcon className="text-[24px] text-purple1" />
                    <span
                        className={`text-base font-semibold text-textGray1 min-w-[200px]`}
                    >
                        Stable connectivity
                    </span>
                </div>
                <div
                    className={`flex items-center h-[32px] w-[72px] rounded-full my-[24px] bg-white bg-opacity-10 transition-all duration-300 relative ${
                        sidebarToggleCollapse ? "ml-2.5" : "ml-[65px]"
                    }`}
                >
                    <WbIncandescentOutlinedIcon
                        className={`text-[22px] text-purple1 rotate-180 absolute top-0 bottom-0 m-auto ${
                            sidebarToggleCollapse ? "left-2" : "-left-8"
                        } transition-all duration-300`}
                    />
                    <span
                        className={`bg-purple1 ${
                            sidebarToggleCollapse ? "w-[10px]" : "w-[20px]"
                        } h-[20px] rounded-full absolute top-0 bottom-0 right-3 m-auto transition-all duration-300`}
                    />
                </div>
            </div>
        </div>
    )
}
