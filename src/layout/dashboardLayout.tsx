import { Sidebar } from "../components/Core/Sidebar/Sidebar"
import MetamaskModal from "../components/Core/Modal/MetamaskModal"

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen relative overflow-hidden flex flex-row justify-start bg-bgBlack1">
            <Sidebar />
            <div className="w-full overflow-y-scroll">
                <div className="ml-24">{children}</div>
            </div>

            {/* Modal  */}
            <MetamaskModal />
        </div>
    )
}

export default DashboardLayout
