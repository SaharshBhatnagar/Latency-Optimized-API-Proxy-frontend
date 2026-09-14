export async function loginUser(username: string, password: string) {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password})
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Backend error");

    }

    const data = await response.json();

    return data;

};

export async function registerUser(username: string, password: string) {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password})
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Backend error");

    }

    const data = await response.json();

    return data;

};