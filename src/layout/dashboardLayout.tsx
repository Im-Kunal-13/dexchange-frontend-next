import { Sidebar } from "../components/Core/Sidebar/Sidebar"
import AlertWarning from "../components/Alerts/AlertWarning"
import AlertInfo from "../components/Alerts/AlertInfo"
import AlertSuccess from "../components/Alerts/AlertSuccess"
import AlertError from "../components/Alerts/AlertError"
import AlertLoading from "../components/Alerts/AlertLoading"
import MetamaskModal from "../components/Core/Modal/MetamaskModal"

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen relative overflow-hidden flex flex-row justify-start bg-bgBlack1">
            <Sidebar />
            <div className="w-full overflow-y-scroll">
                <div className="ml-24">{children}</div>
            </div>

            {/* Alerts */}
            <AlertWarning />
            <AlertInfo />
            <AlertSuccess />
            <AlertError />
            <AlertLoading />

            {/* Modal  */}
            <MetamaskModal />
        </div>
    )
}

export default DashboardLayout
