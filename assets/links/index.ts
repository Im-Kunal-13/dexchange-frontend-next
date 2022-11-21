import HomeIcon from "@mui/icons-material/Home"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import PollIcon from "@mui/icons-material/Poll"
import PollOutlinedIcon from "@mui/icons-material/PollOutlined"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined"
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from "@mui/icons-material/Bookmark"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import SettingsIcon from "@mui/icons-material/Settings"
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const menuItems = [
    {
        id: 1,
        label: "Home",
        Icon: HomeOutlinedIcon,
        ActiveIcon: HomeIcon,
        link: "/dashboard",
    },
    {
        id: 2,
        label: "Exchange",
        Icon: PollOutlinedIcon,
        ActiveIcon: PollIcon,
        link: "/dashboard/exchange",
    },
    {
        id: 3,
        label: "Wallets",
        Icon: AccountBalanceWalletOutlinedIcon,
        ActiveIcon: AccountBalanceWalletIcon,
        link: "/dashboard/walllets",
    },
    {
        id: 4,
        label: "History",
        Icon: HistoryOutlinedIcon,
        ActiveIcon: HistoryOutlinedIcon,
        link: "/dashboard/history",
    },
    // {
    //     id: 5,
    //     label: "Leaderboard",
    //     Icon: BookmarkBorderOutlinedIcon,
    //     ActiveIcon: BookmarkIcon,
    //     link: "/dashboard/leaderboard",
    // },
    {
        id: 6,
        label: "Settings",
        Icon: SettingsOutlinedIcon,
        ActiveIcon: BookmarkIcon,
        link: "/dashboard/settings",
    },
    {
        id: 7,
        label: "Notifications",
        Icon: NotificationsOutlinedIcon,
        ActiveIcon: NotificationsIcon,
        link: "/dashboard/settings",
    },
]

module.exports = {
    menuItems,
}
