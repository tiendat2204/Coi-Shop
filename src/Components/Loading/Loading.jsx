import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-black animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
        <div className="w-4 h-4 rounded-full bg-black animate-bounce" style={{ animationDelay: '-0.5s' }}></div>
      </div>
    </div>
  );
};

export default Loading;