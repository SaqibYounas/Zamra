"use client";
import Navbar from "./components/Navbar";
import { useState } from "react";

const hubLocations = [
  { name: "New York", x: "22%", y: "32%", status: "Active", color: "#22C55E" },
  { name: "London", x: "44%", y: "24%", status: "Active", color: "#22C55E" },
  { name: "Dubai", x: "56%", y: "38%", status: "Active", color: "#22C55E" },
  { name: "Singapore", x: "72%", y: "48%", status: "Active", color: "#22C55E" },
  { name: "Sydney", x: "80%", y: "70%", status: "Pending", color: "#EAB308" },
  { name: "São Paulo", x: "28%", y: "62%", status: "Active", color: "#22C55E" },
  { name: "Tokyo", x: "78%", y: "32%", status: "Active", color: "#22C55E" },
  { name: "Mumbai", x: "63%", y: "42%", status: "Pending", color: "#EAB308" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", company: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans antialiased">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-green-500">
              Get in Touch
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            CONTACT <span className="font-semibold">US</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="text-lg font-medium mb-2">Customer Support</h2>
            <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
              Our team is available 24/7 to assist with your logistics needs.
              Fill out the form below and we&apos;ll respond within 2 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InputField
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Inc."
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your logistics requirements..."
                  className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
              >
                {submitted ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sent Successfully
                  </>
                ) : (
                  <>
                    Submit Request
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Details */}
          <div className="lg:pl-8">
            <div className="space-y-10">
              <ContactBlock
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                }
                label="Headquarters"
                value="One World Trade Center, New York, NY 10007"
              />

              <ContactBlock
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                }
                label="Phone"
                value="+1 800-TITAN-CORE"
              />

              <ContactBlock
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
                label="Email"
                value="opportunit-logistics.ni"
              />

              <div className="border-t border-white/[0.06]" />

              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-500 mb-4">
                  Office Hours
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Monday – Friday</span>
                    <span>9:00 AM – 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Saturday</span>
                    <span>10:00 AM – 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sunday</span>
                    <span className="text-neutral-500">Closed</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.06]" />

              <div>
                <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-500 mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {["LinkedIn", "Twitter", "GitHub"].map((social) => (
                    <span
                      key={social}
                      className="text-xs text-neutral-500 border border-white/[0.06] rounded-md px-3 py-1.5 hover:border-green-500/30 hover:text-green-500 transition-all cursor-pointer"
                    >
                      {social}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="border border-white/[0.06] rounded-2xl bg-neutral-950/50 overflow-hidden">
          {/* Map Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                Regional Hub Status
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Legend color="#22C55E" label="Active" />
              <Legend color="#EAB308" label="Pending" />
              <Legend color="#6B7280" label="Planned" />
            </div>
          </div>

          {/* Map Area */}
          <div className="relative w-full h-[380px] md:h-[440px]">
            <WorldMap />

            {hubLocations.map((hub) => (
              <div
                key={hub.name}
                className="absolute group"
                style={{ left: hub.x, top: hub.y }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{
                      backgroundColor: hub.color,
                      width: "20px",
                      height: "20px",
                      marginLeft: "-2px",
                      marginTop: "-2px",
                    }}
                  />
                  <div
                    className="relative w-4 h-4 rounded-full border-2 border-black/50"
                    style={{ backgroundColor: hub.color }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <p className="text-xs font-medium">{hub.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: hub.color }}>
                        ● {hub.status}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-neutral-900 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                  </div>
                </div>
              </div>
            ))}

            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="22%" y1="32%" x2="44%" y2="24%" stroke="#22C55E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
              <line x1="44%" y1="24%" x2="56%" y2="38%" stroke="#22C55E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
              <line x1="56%" y1="38%" x2="72%" y2="48%" stroke="#22C55E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
              <line x1="72%" y1="48%" x2="80%" y2="70%" stroke="#EAB308" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />
              <line x1="22%" y1="32%" x2="28%" y2="62%" stroke="#22C55E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
              <line x1="72%" y1="48%" x2="78%" y2="32%" stroke="#22C55E" strokeWidth="0.5" opacity="0.15" strokeDasharray="4 4" />
              <line x1="56%" y1="38%" x2="63%" y2="42%" stroke="#EAB308" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Map Footer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/[0.06]">
            <MapStat value="7" label="Active Hubs" />
            <MapStat value="2" label="Pending" />
            <MapStat value="140+" label="Countries Served" />
            <MapStat value="99.7%" label="Uptime SLA" />
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="relative border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-green-500/[0.04] blur-[100px] rounded-full pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">
                Ready to <span className="font-semibold">Integrate?</span>
              </h2>
              <p className="text-sm text-neutral-400 mt-2">
                Start your logistics transformation today. No commitment required.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button className="bg-green-500 hover:bg-green-400 text-black font-semibold text-sm px-8 py-3.5 rounded-lg transition-all duration-200 hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center gap-2">
                Schedule a Demo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="border border-white/10 hover:border-white/20 text-sm px-6 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/[0.03]">
                View Docs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────── */

function InputField({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-neutral-950 border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
      />
    </div>
  );
}

function ContactBlock({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-white/[0.06] flex items-center justify-center text-green-500 shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-500 mb-1">
          {label}
        </p>
        <p className="text-sm leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-neutral-500">{label}</span>
    </div>
  );
}

function MapStat({ value, label }) {
  return (
    <div className="px-6 py-4 border-r border-white/[0.06] last:border-r-0">
      <p className="text-xl font-semibold tracking-tight">{value}</p>
      <p className="text-[11px] text-neutral-500 mt-0.5">{label}</p>
    </div>
  );
}

/* ── Simplified World Map ────────────────────────────── */
function WorldMap() {
  return (
    <svg
      viewBox="0 0 1000 500"
      className="absolute inset-0 w-full h-full opacity-[0.12]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M120 80 L180 60 L220 70 L250 90 L260 130 L250 160 L240 190 L220 210 L200 230 L170 240 L150 230 L130 200 L110 170 L100 140 L105 110 Z" fill="white" />
      <path d="M150 240 L170 250 L180 280 L160 300 L140 290 L130 270 Z" fill="white" />
      <path d="M220 260 L250 250 L270 270 L280 300 L275 340 L260 380 L240 410 L220 420 L210 400 L205 360 L210 320 L215 290 Z" fill="white" />
      <path d="M430 60 L460 50 L490 55 L510 70 L520 90 L510 110 L490 120 L470 125 L450 115 L440 100 L430 80 Z" fill="white" />
      <path d="M460 140 L490 130 L520 140 L540 170 L550 210 L545 260 L530 300 L510 330 L490 340 L470 330 L455 300 L450 260 L445 220 L450 180 Z" fill="white" />
      <path d="M550 50 L600 40 L660 45 L720 55 L770 70 L800 90 L810 120 L790 150 L760 170 L720 180 L680 175 L640 160 L610 140 L580 120 L560 100 L545 75 Z" fill="white" />
      <path d="M640 180 L660 175 L670 200 L665 230 L650 250 L635 240 L630 215 Z" fill="white" />
      <path d="M720 180 L740 175 L755 190 L750 210 L735 220 L720 210 L715 195 Z" fill="white" />
      <path d="M770 300 L810 290 L840 300 L855 320 L850 350 L830 370 L800 375 L775 365 L765 340 L760 320 Z" fill="white" />
      <path d="M280 30 L310 20 L340 25 L350 45 L335 60 L310 65 L285 55 Z" fill="white" />
      <path d="M790 100 L800 90 L805 110 L798 125 L790 118 Z" fill="white" />
      <path d="M420 65 L428 58 L432 72 L425 80 L418 75 Z" fill="white" />
    </svg>
  );
}