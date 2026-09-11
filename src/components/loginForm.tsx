import { useState } from 'react';
import { loginUser } from '../services/authService';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {

    const [username, setUsername] = useState(""); 

    const [password, setPassword] = useState(""); 

    const [error, setError] = useState(""); 

    const [isLoading, setIsLoading] = useState(false); 

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");
        setIsLoading(true);

        try {
            const response = await loginUser(username, password);

            localStorage.setItem('jwt', response.token);

            onLoginSuccess();
        }
        catch (err: any) {
            setError(err.message);

        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} 
        className="bg-brand-white p-8 rounded-lg shadow-md flex flex-col gap-4"
        >
            <input type="text" placeholder="Enter username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded focus:outline-brand-gold bg-brand-sand/20"
            ></input>

            <input type="password" placeholder="Enter password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded focus:outline-brand-gold bg-brand-sand/20"
            ></input>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={isLoading}
            className="bg-brand-gold text-brand-charcoal py-2 rounded font-bold hover:bg-opacity-90 disabled:opacity-50">
                {isLoading ? 'Logging is...' : 'Login'}
            </button>
        </form>
    );

};