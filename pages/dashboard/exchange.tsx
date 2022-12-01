import Head from "next/head"
import NavbarV2 from "../../components/Dashboard/NavbarV2"
import DashboardLayout from "../../layout/dashboardLayout"
import ExchangeLayout from "../../layout/exchangeLayout"

const exchange = () => {
    return (
        <DashboardLayout>
            <Head>
                <title>Dexchange</title>
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
            </Head>
            <NavbarV2 />
            <ExchangeLayout />
        </DashboardLayout>
    )
}

export default exchange
