import { NoSsr } from "@material-ui/core"
import Head from "next/head"
import NavbarV2 from "../../components/Dashboard/NavbarV2"
import DashboardLayout from "../../layout/dashboardLayout"
import ExchangeLayout from "../../layout/exchangeLayout"

const exchange = () => (
    <DashboardLayout>
        <Head>
            <title>Dexchange</title>
            <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
            />
        </Head>
        <NoSsr>
            <NavbarV2 />
        </NoSsr>
        <ExchangeLayout />
    </DashboardLayout>
)

export default exchange
