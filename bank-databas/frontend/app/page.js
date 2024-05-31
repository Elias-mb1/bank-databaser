import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: "beige",
      }}
      className="w-full min-h-screen flex flex-col"
    >
      
      <nav className="p-4 flex items-center justify-between bg-gray-400">
        <Link href="/" passHref>
          <h1 className="font-extrabold text-blue-500 cursor-pointer">
            Blå Banken
          </h1>
        </Link>
        <div className="flex space-x-4 items-center">
          <Link href="/login" passHref>
            <span>Logga in</span>
          </Link>
          <span>|</span> {/* Separator */}
          <Link href="/Newuser" passHref>
            <span>Skapa Konto</span>
          </Link>
        </div>
      </nav>

      <section className="flex-grow flex flex-col justify-center items-center">
        <h1 className="text-5xl">Välkommen till Blå <span className="text-blue-500">banken</span></h1>
        <div className="flex space-x-10">
          <Link
            href="/login"
            className="bg-blue-500 p-4 text-white rounded-md border-2 border-solid hover:bg-blue-600"
          >
            Logga in
          </Link>
          <Link
            href="/Newuser"
            className="bg-blue-500 p-4 text-white rounded-md border-2 border-solid hover:bg-blue-600"
          >
            Skapa Konto
          </Link>
        </div>
      </section>

    </main>
  );
}
