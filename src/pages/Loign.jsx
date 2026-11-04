
import React, { useState } from "react";
import "../styles/Login.css";

function Login() {

    const [role, setRole] = useState("resident");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        console.log("Selected Role:", role);
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Society Management System</h1>
                <p>Welcome! Please login to continue.</p>

                <form onSubmit={handleLogin}>

                    <label>Select Role</label>

                    <div className="role-selector">

                        <button
                            type="button"
                            className={role === "admin" ? "active" : ""}
                            onClick={() => setRole("admin")}
                        >
                            Admin
                        </button>

                        <button
                            type="button"
                            className={role === "resident" ? "active" : ""}
                            onClick={() => setRole("resident")}
                        >
                            Resident
                        </button>

                    </div>

                    <label>Email Address</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="login-button">
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;
