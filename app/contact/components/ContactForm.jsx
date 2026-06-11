"use client";

import { useState } from "react";

export default function ContactForm() {
  const [fleet, setFleet] = useState("Intermodal Logistics");
  const [message, setMessage] = useState("");

  return (
    <div className="bg-[#0f1a0f]/80 border border-white/10 rounded-xl p-7 flex flex-col gap-5 backdrop-blur-sm">
      <h2 className="text-white font-bold text-base">Contact Customer Support</h2>

      <div className="grid grid-cols-2 gap-4">
        <input className="bg-black p-2 text-white" placeholder="Name" />
        <input className="bg-black p-2 text-white" placeholder="Email" />
      </div>

      <select
        className="bg-black p-2 text-white"
        value={fleet}
        onChange={(e) => setFleet(e.target.value)}
      >
        <option>Intermodal Logistics</option>
        <option>Air Freight</option>
        <option>Ocean Freight</option>
        <option>Last Mile Delivery</option>
        <option>Warehousing</option>
      </select>

      <textarea
        className="bg-black p-2 text-white"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="w-full bg-green-500 text-black font-bold py-3">
        Submit
      </button>
    </div>
  );
}