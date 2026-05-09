const Loading = () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
  
          <div>
            <h2 className="text-xl font-semibold">
              Loading FinanceRisk AI
            </h2>
  
            <p className="mt-2 text-sm text-gray-500">
              Preparing analytics dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Loading;