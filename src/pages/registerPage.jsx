import { useState } from "react";
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import api from "../services/api.js";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.data?.token ||
        response.data.data?.accessToken;
      const user =
        response.data.user ||
        response.data.data?.user ||
        response.data.data?.userData;

      if (!token || !user) {
        throw new Error(
          "Registration succeeded, but authentication data was incomplete"
        );
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href =
        user.role === "ADMIN" ? "/admin" : "/properties";
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.message;

      if (responseMessage && typeof responseMessage === "object") {
        const firstError = Object.values(responseMessage)
          .flat()
          .find(Boolean);

        setError(firstError || "Unable to register");
      } else {
        setError(
          responseMessage ||
            requestError.message ||
            "Unable to register"
        );
      }
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
            <h1>RoomShare</h1>
            <p>Create an account</p>
          </div>
        </div>

        <div className="login-heading">
          <h2>Join RoomShare</h2>
          <p>Register to find your next place.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <div className="login-input">
            <UserRound size={19} />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="email">Email</label>
          <div className="login-input">
            <Mail size={19} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
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
              autoComplete="new-password"
              required
            />
          </div>

          <label htmlFor="confirmPassword">Confirm password</label>
          <div className="login-input">
            <LockKeyhole size={19} />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
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
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
