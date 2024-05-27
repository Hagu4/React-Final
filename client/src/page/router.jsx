import { createBrowserRouter } from 'react-router-dom'
import {Home} from "./Home/Home.jsx";
import {Auth} from "./Auth/Auth.jsx";
import {AccountPage} from "./AccountPage/Home.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/account",
        element: <AccountPage />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
])