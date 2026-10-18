import { Outlet, useNavigation } from "react-router-dom"
import { Loading } from "./Loading";
import { DonorNavbar } from "./DonorNavbar";
import { useEffect, useState } from "react";
export const DonorLayout = () => {
    const navigation = useNavigation();
    const [donor, setDonor] = useState(null);

    useEffect(() => {
        const getDonor = async () => {
            try {
                const res = await fetch("/api/donor/dashboard", {
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setDonor(data);
                }
            } catch (error) {
                console.error("Failed to fetch donor profile:", error);
            }
        };

        getDonor();
    }, []);
    return (
        <>
            <DonorNavbar donor={donor} />
            {navigation.state === "loading" ? (
                <Loading />
            ) : (
                <Outlet />
            )}
        </>
    )
}