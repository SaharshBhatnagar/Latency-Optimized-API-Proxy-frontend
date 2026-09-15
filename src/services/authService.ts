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

export const resetPassword = async (username: string, newPassword: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Password reset failed');
    return data;
};