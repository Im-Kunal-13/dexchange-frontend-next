import { Sidebar } from "../components/Core/Sidebar/Sidebar"

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen relative overflow-hidden flex flex-row justify-start bg-bgBlack1">
            <Sidebar />
            <div className="w-full overflow-y-scroll">
                <div className="p-7">{children}</div>
            </div>
        </div>
    )
}

export default Layout
