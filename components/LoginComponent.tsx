import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google" }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const data = await response.json();
        setError(data.error || "Google 로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("Google 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <h1>로그인</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button onClick={handleGoogleLogin}>Google로 로그인</button>
    </div>
  );
}

export default LoginComponent;
