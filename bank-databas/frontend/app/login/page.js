"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:3001/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", data.token);
        router.push("/Account");
      } else {
        setErrorMessage("Fel användarnamn eller lösenord");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Inloggningsfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        backgroundColor: "beige",
      }}
      className="w-full min-h-screen flex flex-col"
    >
      {/* Navbar */}
      <nav className="p-4 flex items-center justify-between bg-gray-400">
        <Link href="/" passHref>
          <h1 className="font-extrabold text-blue-500 cursor-pointer">
            Blå Banken
          </h1>
        </Link>
      </nav>

      <div className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Medlem</h1>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4 w-80">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              aria-label="Användarnamn"
            />
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded"
              aria-label="Lösenord"
            />
          </div>
          <div className="flex flex-col justify-start">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </div>
        </form>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </main>
  );
}
