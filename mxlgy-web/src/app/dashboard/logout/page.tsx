'use client'

import { useEffect } from "react";
import { logout } from "@/app/actions";

export default function Logout() {
  useEffect(() => {
    logout()
  }, [])
}
