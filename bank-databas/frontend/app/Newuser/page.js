"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Newuser() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNewuser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      const data = await response.json();
      console.log(data); // Successfully signed up, navigate to the login page

      router.push("/login");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create an account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{ backgroundColor: "beige" }}
      className="w-full min-h-screen flex flex-col"
    >
      {/* Navbar */}
      <nav className="p-4 flex items-center justify-between bg-gray-400">
        <Link href="/" passHref>
          <h1 className="font-extrabold text-blue-500 cursor-pointer">
            Blå Banken
          </h1>
        </Link>
        <div className="flex space-x-4">
          <Link href="/login" passHref>
            <span className="cursor-pointer">Logga in</span>
          </Link>
        </div>
      </nav>

      <div className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Ny användare</h1>
        <form onSubmit={handleNewuser} className="flex flex-col space-y-4 w-80">
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
              {loading ? "Skapar konto..." : "Skapa konto"}
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </main>
  );
}
