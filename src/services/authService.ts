const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function loginUser(username: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
    }
    return data;
}

export async function registerUser(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }
    return data;
}

export async function forgotPassword(email: string) {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link");
    }
    return data;
}

export async function resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
    }
    return data;
}