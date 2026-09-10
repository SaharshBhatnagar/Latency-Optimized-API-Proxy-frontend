export async function loginUser(username: string, password: string) {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await delay(1000);

    if (username === "username" && password === "password") {
        return { token: "fake-jwt-token-123" };
    }
    else {
        throw new Error("Invalid Credentials");
    }
};