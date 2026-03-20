function SuspenseLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo/Brand */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-brand-accent-600 to-brand-accent-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
          <div className="relative w-16 h-16 bg-linear-to-br from-brand-accent-600 to-brand-accent-700 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Loading</h2>
          <p className="text-sm text-gray-600">Please wait a moment...</p>
        </div>

        {/* Animated Progress Dots */}
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-brand-accent-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-2 h-2 bg-brand-accent-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-brand-accent-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
}

export default SuspenseLoader;
