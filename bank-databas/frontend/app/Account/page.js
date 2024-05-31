"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Saldo() {
  const [saldo, setSaldo] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    
    const fetchSaldo = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming you store token in localStorage upon login
        const response = await fetch("http://localhost:3001/me/accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
        const data = await response.json();
        console.log(data); 
        setSaldo(data.amount);
      } catch (error) {
        console.error("Error:", error);
        
      }
    };

    fetchSaldo();

    return () => {
      // Cleanup logic (if needed)
    };
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();
    // Perform transaction logic here (fetch request to backend)
    try {
      const token = localStorage.getItem("token"); // Assuming you store token in localStorage upon login
      const response = await fetch(
        "http://localhost:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, amount }),
        }
      );
      const data = await response.json();
      console.log(data); 
      // Update after transaction
      setSaldo(data.newBalance);
      setMessage("Transaktionen lyckades!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Transaktionen misslyckades.");
    }
  };

  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem("token");
    // Redirect to home page
    router.push("/");
  };

  return (
    <main
      style={{
        background: "beige",
      }}
      className="w-full min-h-screen flex flex-col"
    >
      {/* Navbar */}
      <nav className="p-4 flex items-center justify-between bg-gray-400">
        <Link href="/" passHref>
          <h1 className="font-extrabold text-white cursor-pointer">Blå Banken</h1>
        </Link>
        <button onClick={handleLogout} className="text-white">Logout</button>
      </nav>

      <div className="flex-grow flex flex-col justify-center items-center">
        <h1>Konto</h1>

        {saldo !== null ? (
          <div className="bg-blue-300 border-solid border-2 rounded-lg overflow-hidden m-5 p-5">
            <h2>Ditt saldo är: {saldo} kr</h2>
            <form onSubmit={handleTransaction}>
              <input
                type="number"
                placeholder="Belopp"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="m-2 p-2"
              />
              <button type="submit" className="m-2 p-2 bg-blue-500 text-white rounded">Transaktion</button>
            </form>

            {message && <p>{message}</p>}
          </div>
        ) : (
          <p>Laddar saldo...</p>
        )}
      </div>
      
    </main>
  );
}
