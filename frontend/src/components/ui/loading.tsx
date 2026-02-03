import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-5 h-5 bg-red-500 rounded-full"
            style={{
              animation: `liquid 1.4s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>

      <style>
        {`
          @keyframes liquid {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.3;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loading;
