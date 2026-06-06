const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-red-800 font-semibold mb-1">Error</h3>
        <p className="text-red-600 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;

