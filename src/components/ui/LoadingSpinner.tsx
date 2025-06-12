const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
    <span className=" text-gray-400 lil-font">Loading...</span>
  </div>
);

export default LoadingSpinner