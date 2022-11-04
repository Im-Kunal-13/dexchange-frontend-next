import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })
import { createChart, ColorType } from "lightweight-charts"

const DemoChart = () => {
    return (
        <div className="app w-[75vw] m-auto my-40">
            <div className="row">
                <div className="mixed-chart">
                    {typeof window !== "undefined" && <></>}
                </div>
            </div>
        </div>
    )
}

export default DemoChart
