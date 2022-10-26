import React from "react"

export const Banner = ({ text }: { text: string }) => {
    return (
        <div className="banner">
            <h1>{text}</h1>
        </div>
    )
}
