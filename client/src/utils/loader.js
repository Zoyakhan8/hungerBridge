export const protectedLoader = (allowedRoles = []) => {
    return async () => {
        const response = await fetch("/api/auth/authenticate", {
            credentials: "include",
        });
        if (response.status === 401) {
            throw new Response("Not authenticated", {
                status: 401,
            });
        }
        if (response.status === 403) {
            throw new Response("Access denied", {
                status: 403,
            });
        }
        if (!response.ok) {
            throw new Response("Something went wrong", {
                status: response.status,
            });
        }
        const data = await response.json();
        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(data.user.role)
        ) {
            throw new Response("Access denied", {
                status: 403,
            });
        }

        return data;
    };
};