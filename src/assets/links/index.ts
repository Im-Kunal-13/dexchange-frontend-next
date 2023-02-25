import HomeIcon from "@mui/icons-material/Home"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import PollIcon from "@mui/icons-material/Poll"
import PollOutlinedIcon from "@mui/icons-material/PollOutlined"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SettingsIcon from '@mui/icons-material/Settings';

export const menuItems = [
    {
        id: 1,
        label: "Home",
        Icon: HomeOutlinedIcon,
        ActiveIcon: HomeIcon,
        link: "/",
    },
    {
        id: 2,
        label: "Exchange",
        Icon: PollOutlinedIcon,
        ActiveIcon: PollIcon,
        link: "/exchange",
    },
    {
        id: 3,
        label: "Wallets",
        Icon: AccountBalanceWalletOutlinedIcon,
        ActiveIcon: AccountBalanceWalletIcon,
        link: "/wallets",
    },
    {
        id: 4,
        label: "History",
        Icon: HistoryOutlinedIcon,
        ActiveIcon: HistoryOutlinedIcon,
        link: "/history",
    },
    {
        id: 6,
        label: "Settings",
        Icon: SettingsOutlinedIcon,
        ActiveIcon: SettingsIcon,
        link: "/settings",
    },
    {
        id: 7,
        label: "Notifications",
        Icon: NotificationsOutlinedIcon,
        ActiveIcon: NotificationsIcon,
        link: "/notifications",
    },
]

module.exports = {
    menuItems,
}
