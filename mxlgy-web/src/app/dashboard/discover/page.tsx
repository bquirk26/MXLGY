'use client'

import { useState } from 'react'

export default function Discover() {
  return (
    <div className="flex flex-col gap-y-16 items-center text-green-500">
      <h1 className="text-5xl font-extrabold">Discover</h1>

      <Slider />

      <button className="text-2xl rounded-full font-semibold border-2 border-green-500 hover:bg-green-100 px-4 py-2 transition">Get Recommendations</button>
    </div>
  )
}

function Slider() {
  const [value, setValue] = useState<number>(30)
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()

    setValue(parseInt(e.target.value))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-green-500 font-bold text-3xl">${value}</p>
      <input onChange={handleChange} value={value} className="w-48 accent-green-500 hover:cursor-pointer" type="range" min="1" max="100" step="1" />
    </div>
  )
}
