import { Outlet, useNavigation } from "react-router-dom"
import { Loading } from "./Loading";
import { DonorNavbar } from "./DonorNavbar";
export const DonorLayout = () => {
    const navigation = useNavigation();
    return (
        <>
            <DonorNavbar />
            {navigation.state === "loading" ? (
                <Loading />
            ) : (
                <Outlet />
            )}
        </>
    )
}