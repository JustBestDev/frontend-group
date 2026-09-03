import { useState } from "react";
import {
  Building2,
  Home,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  login,
  register,
} from "../../services/authService.js";
import useAuthStore from "../../stores/authStore.js";

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState("login");
  const [accountPurpose, setAccountPurpose] =
    useState("CUSTOMER");
  const [applicantType, setApplicantType] =
    useState("OWNER");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    const authentication = await login({
      email: formData.email,
      password: formData.password,
    });
    setAuth(authentication);
    onClose();

    navigate(
      authentication.user.role === "ADMIN"
        ? "/admin"
        : authentication.user.role === "OWNER"
          ? "/owner"
          : "/properties",
          { replace: true }
    );
  };

  const handleRegister = async () => {
    if (
      formData.password !== formData.confirmPassword
    ) {
      throw new Error("Passwords do not match");
    }

    await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (accountPurpose === "CUSTOMER") {
      setSuccess(
        "Account created successfully. You can now log in."
      );

      setMode("login");

      setFormData((currentForm) => ({
        ...currentForm,
        password: "",
        confirmPassword: "",
      }));

      return;
    }

    const authentication = await login({
      email: formData.email,
      password: formData.password,
    });
    setAuth(authentication);

    sessionStorage.setItem(
      "ownerApplicantType",
      applicantType
    );

    navigate("/owner-application");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (requestError) {
      const responseMessage =
        requestError.response?.data?.message;

      if (
        responseMessage &&
        typeof responseMessage === "object"
      ) {
        const firstError = Object.values(
          responseMessage
        )
          .flat()
          .find(Boolean);

        setError(firstError || "Unable to continue");
      } else {
        setError(
          responseMessage ||
            requestError.message ||
            "Unable to continue"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-modal-overlay"
      onMouseDown={onClose}
    >
      <section
        className="auth-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="auth-modal-header">
          <div>
            <h2>Welcome to RoomShare</h2>

            <p>
              Find a room or start listing your property.
            </p>
          </div>

          <button
            type="button"
            className="auth-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </header>

        <div className="auth-modal-content">
          <div className="auth-modal-logo">
            <ShieldCheck size={31} />
          </div>

          <div className="auth-mode-tabs">
            <button
              type="button"
              className={
                mode === "login" ? "active" : ""
              }
              onClick={() => changeMode("login")}
            >
              Log in
            </button>

            <button
              type="button"
              className={
                mode === "register" ? "active" : ""
              }
              onClick={() => changeMode("register")}
            >
              Register
            </button>
          </div>

          <form
            className="auth-modal-form"
            onSubmit={handleSubmit}
          >
            {mode === "register" && (
              <>
                <div className="account-purpose-section">
                  <p>What would you like to do?</p>

                  <div className="account-purpose-options">
                    <button
                      type="button"
                      className={
                        accountPurpose === "CUSTOMER"
                          ? "account-purpose-card active"
                          : "account-purpose-card"
                      }
                      onClick={() =>
                        setAccountPurpose("CUSTOMER")
                      }
                    >
                      <Home size={23} />

                      <span>
                        <strong>Find a home</strong>
                        <small>
                          Browse and rent properties
                        </small>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={
                        accountPurpose === "LISTER"
                          ? "account-purpose-card active"
                          : "account-purpose-card"
                      }
                      onClick={() =>
                        setAccountPurpose("LISTER")
                      }
                    >
                      <Building2 size={23} />

                      <span>
                        <strong>List a property</strong>
                        <small>
                          Apply as an owner or agent
                        </small>
                      </span>
                    </button>
                  </div>
                </div>

                {accountPurpose === "LISTER" && (
                  <div className="applicant-type-section">
                    <p>I am registering as</p>

                    <div className="applicant-type-options">
                      <button
                        type="button"
                        className={
                          applicantType === "OWNER"
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setApplicantType("OWNER")
                        }
                      >
                        <UserRound size={18} />
                        Property owner
                      </button>

                      <button
                        type="button"
                        className={
                          applicantType === "AGENT"
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setApplicantType("AGENT")
                        }
                      >
                        <UsersRound size={18} />
                        Property agent
                      </button>
                    </div>
                  </div>
                )}

                <div className="auth-modal-input">
                  <UserRound size={19} />

                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>
              </>
            )}

            <div className="auth-modal-input">
              <Mail size={19} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-modal-input">
              <LockKeyhole size={19} />

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                required
              />
            </div>

            {mode === "register" && (
              <div className="auth-modal-input">
                <LockKeyhole size={19} />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {error && (
              <p className="auth-modal-error">
                {error}
              </p>
            )}

            {success && (
              <p className="auth-modal-success">
                {success}
              </p>
            )}

            <button
              type="submit"
              className="auth-modal-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Log in"
                  : accountPurpose === "CUSTOMER"
                    ? "Create customer account"
                    : `Continue as ${applicantType.toLowerCase()}`}
            </button>
          </form>

          <p className="auth-modal-terms">
            By continuing, you agree to RoomShare&apos;s
            Terms of Service and Privacy Policy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AuthModal;
