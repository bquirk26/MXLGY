"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/actions";


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();

    const id = await digestMessage(email + password);

    try {
      await login(id);
    } catch (error) {
      alert("Failed to login.");
    }
  }


  async function handleSignup(e: React.SyntheticEvent) {
    e.preventDefault();

    const id = await digestMessage(email + password);

    try {
      await signup(id);
    } catch (error) {
      alert("Failed to signup.");
    }
  }

  // Mozilla Developer Network Example
  async function digestMessage(message: string) {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return hashHex;
  }

  return (
    <div className="flex flex-col gap-y-8 items-center">
      <h1 className="text-5xl font-extrabold">Login</h1>
      <form className="flex flex-col gap-8 w-72 text-lg">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="px-4 py-2 rounded-lg ring-2 ring-black" placeholder="Email" type="email" name="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-2 rounded-lg ring-2 ring-black" placeholder="Password" type="password" name="password" minLength={4} required />
        <div className="grid grid-cols-2 gap-4">
          <button onClick={handleLogin} className="cursor-pointer hover:bg-black/10 transition font-semibold ring-2 ring-black px-4 py-2 rounded-lg text-black" type="submit">Login</button>
          <button onClick={handleSignup} className="cursor-pointer hover:bg-black/10 transition font-semibold ring-2 ring-black px-4 py-2 rounded-lg text-black" type="submit">Signup</button>
        </div>
      </form>
    </div>
  )
}
