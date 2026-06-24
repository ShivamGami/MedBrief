export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type HttpRequest = "POST" | "GET" | "DELETE" | "PUT" | "PATCH";

async function refreshToken(): Promise<boolean> {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("access", data.access_token);
    if (data.refresh_token) localStorage.setItem("refresh", data.refresh_token);
    return true;
}

export async function API<T = any>(
    method: HttpRequest,
    url: string,
    data?: unknown
): Promise<T> {
    const makeRequest = async (): Promise<Response> => {
        const access = localStorage.getItem("access");
        const isFormData = data instanceof FormData;

        return fetch(`${API_BASE_URL}${url}`, {
            method,
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" }),
                ...(access ? { Authorization: `Bearer ${access}` } : {}),
            },
            ...(method !== "GET" && data ? { body: isFormData ? data : JSON.stringify(data) } : {}),
        });
    };

    let res = await makeRequest();
    if (res.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            throw new Error("Session expired");
        }
        res = await makeRequest();
    }

    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return res.json();
}