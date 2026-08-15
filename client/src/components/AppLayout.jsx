import { Outlet, useNavigation } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { Loading } from "./Loading";
export const AppLayout = () => {
    const navigation = useNavigation();
    return (
        <>
            <Navbar />
            {navigation.state === "loading" ? (
                <Loading />
            ) : (
                <Outlet />
            )}
            <Footer />
        </>
    )
}