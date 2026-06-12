export default function ReadyToIntegrate() {
  return (
    <section className="py-20 text-center bg-black">
      <h2 className="text-4xl font-black text-white">
        Ready to <span className="text-green-400">Integrate?</span>
      </h2>

      <p className="text-gray-400 mt-4">
        Experience the future of logistics network.
      </p>

      <div className="mt-8 flex gap-4 justify-center">
        <button className="bg-green-500 text-black px-6 py-3 font-bold">
          Get Started
        </button>
        <button className="border border-white/20 text-white px-6 py-3">
          Download Specs
        </button>
      </div>
    </section>
  );
}