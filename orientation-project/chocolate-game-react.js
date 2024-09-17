import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const PieChartWheelGame = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [rotation, setRotation] = useState(0);
  const options = [
    { name: 'Chocolate', color: '#8B4513', weight: 1 },
    { name: 'Better luck\nnext time', color: '#FFD700', weight: 2.33333 },
    { name: 'Chocolate', color: '#D2691E', weight: 1 },
    { name: 'Better luck\nnext time', color: '#DAA520', weight: 2.33333 },
    { name: 'Chocolate', color: '#CD853F', weight: 1 },
    { name: 'Better luck\nnext time', color: '#F0E68C', weight: 2.33333 }
  ];

  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(var(--end-rotation));
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const spinWheel = () => {
    setSpinning(true);
    setResult(null);
    const spins = 5 + Math.random() * 5; // Between 5 and 10 full spins
    const newRotation = 360 * spins + Math.floor(Math.random() * 360);
    setRotation(newRotation);
    
    setTimeout(() => {
      const randomValue = Math.random() * totalWeight;
      let weightSum = 0;
      const selectedOption = options.find(option => {
        weightSum += option.weight;
        return randomValue < weightSum;
      });
      setResult(selectedOption.name);
      setSpinning(false);
    }, 5000);
  };

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Chocolate or Luck Wheel</h1>
        <div className="relative w-64 h-64 mb-6">
          <svg 
            viewBox="-1 -1 2 2" 
            style={{ 
              animation: spinning ? 'spin 5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards' : 'none',
              '--end-rotation': `${rotation}deg`,
            }}
          >
            {options.map((option, i) => {
              let startPercent = options.slice(0, i).reduce((sum, opt) => sum + opt.weight, 0) / totalWeight;
              let endPercent = startPercent + option.weight / totalWeight;
              const [startX, startY] = getCoordinatesForPercent(startPercent);
              const [endX, endY] = getCoordinatesForPercent(endPercent);
              const [midX, midY] = getCoordinatesForPercent((startPercent + endPercent) / 2);
              const largeArcFlag = endPercent - startPercent > 0.5 ? '1' : '0';
              
              return (
                <g key={i}>
                  <path
                    d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`}
                    fill={option.color}
                  />
                  <text
                    x={midX * 0.65}
                    y={midY * 0.65}
                    textAnchor="middle"
                    fill="white"
                    fontSize="0.1"
                    fontWeight="bold"
                    transform={`rotate(${(startPercent + endPercent) * 180} ${midX * 0.65} ${midY * 0.65})`}
                  >
                    {option.name.split('\n').map((line, index) => (
                      <tspan key={index} x={midX * 0.65} dy={index ? "0.1" : "0"}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <ArrowDown className="w-8 h-8 text-gray-800" />
          </div>
        </div>
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </button>
        {result && (
          <p className="mt-4 text-center text-lg font-semibold">
            Result: <span className="text-blue-500">{result.replace('\n', ' ')}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PieChartWheelGame;