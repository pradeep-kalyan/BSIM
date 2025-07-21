export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-slate-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Simulation Not Found</h2>
        <p className="text-gray-300 mb-8">
          The simulation you're looking for doesn't exist or has been deleted.
        </p>
        <a
          href="/simulations"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Back to Simulations
        </a>
      </div>
    </div>
  );
}
