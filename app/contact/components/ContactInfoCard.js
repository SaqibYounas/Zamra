export default function ContactInfoCard({ icon, label, primary, secondary }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#0f1a0f]/60 border border-white/8 rounded-xl">
      <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-[10px] text-gray-600 uppercase">{label}</p>
        <p className="text-white text-sm font-semibold">{primary}</p>
        <p className="text-gray-500 text-xs">{secondary}</p>
      </div>
    </div>
  );
}