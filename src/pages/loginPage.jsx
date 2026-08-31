import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", formData);

            const token =
                response.data.token ||
                response.data.accessToken ||
                response.data.data?.token ||
                response.data.data?.accessToken;

            if (!token) {
                throw new Error("Login succeeded, but no token was returned");
            }

            localStorage.setItem("token", token);

            window.location.href = "/admin";
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                    requestError.message ||
                    "Unable to log in"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <section className="login-card">
                <div className="login-brand">
                    <div className="login-logo">
                        <ShieldCheck size={32} />
                    </div>

                    <div>
                        <h1>RoomRoomShare</h1>
                        <p>Admin Panel</p>
                    </div>
                </div>

                <div className="login-heading">
                    <h2>Welcome back</h2>
                    <p>Log in with your administrator account</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>

                    <div className="login-input">
                        <Mail size={19} />

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <label htmlFor="password">Password</label>

                    <div className="login-input">
                        <LockKeyhole size={19} />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;