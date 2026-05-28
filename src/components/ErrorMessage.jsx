export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-md max-w-md mx-auto">
      <div className="flex items-center">
        <div className="flex-shrink-0 text-red-500">
          ⚠️
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 font-medium">
            {message || "An error occurred while fetching the data."}
          </p>
        </div>
      </div>
    </div>
  );
}
