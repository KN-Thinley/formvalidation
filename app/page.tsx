import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Go to form</div>
      <Link href={"/signup"}>Sign Up</Link>
    </main>
  );
}
