import { NavLink, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();
    const status = error?.status;
    const errorData = {
        404: {
            title: "Page Not Found",
            message: "The page you are looking for could not be found.",
            button: "Go back to Homepage",
            link: "/",
        },
        403: {
            title: "Access Denied",
            message: "You don't have permission to access this page.",
            button: "Go back to Homepage",
            link: "/",
        },
        401: {
            title: "Not Authenticated",
            message: "Please log in to continue.",
            button: "Go back to Login Page",
            link: "/login",
        },
    };

    const current = errorData[status] ?? {
        title: "Something went wrong",
        message: "An unexpected error occurred.",
        button: "Go back to Homepage",
        link: "/",
    };

    return (
        <div className="bg-brown min-h-screen flex items-center justify-center">
            <div className="bg-background flex flex-col justify-center p-8 gap-4 rounded-xl border border-primary/20 shadow-xl shadow-black/10">
                <div className="text-center">
                    <p className="text-heading text-xl font-bold py-1">
                        {current.title}
                    </p>

                    <p className="text-inactive text-lg">
                        {current.message}
                    </p>
                </div>

                <NavLink
                    to={current.link}
                    className="inline-block px-10 py-3 bg-primary text-center
                    border border-white/20 text-brown rounded-[10px] text-xl font-bold
                    shadow-[0_4px_20px] shadow-primary/50
                    hover:shadow-[0_4px_30px] hover:scale-102 transition-all duration-300"
                >
                    {current.button}
                </NavLink>
            </div>
        </div>
    );
};