const QuickActions = () => {
  return (
    <div className="fixed bottom-10 right-10">
      <button className="text-white font-bold bg-blue-500 p-4 mr-4 rounded-full shadow-lg">
        Repair Request
      </button>

      <button className="text-white font-bold bg-blue-500 p-4 rounded-full shadow-lg">
        Add New Product
      </button>
      {/* Add other buttons here */}
    </div>
  );
};

export default QuickActions;
