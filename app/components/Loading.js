import React from "react";

const Loading = () => {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="dot w-3 h-3 bg-blue-500 rounded-full"></div>
        <div className="dot w-3 h-3 bg-blue-400 rounded-full"></div>
        <div className="dot w-3 h-3 bg-blue-300 rounded-full"></div>
      </div>

      <style jsx>{`
        .dot {
          animation: smoothPulse 1.4s ease-in-out infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes smoothPulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
