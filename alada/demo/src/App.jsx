import React, { useState, useEffect } from 'react';

const SpinWheel = () => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [webSocket, setWebSocket] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.0.105:81/');
    socket.onopen = () => {
      console.log('WebSocket is connected');
    };
    socket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
    };
    setWebSocket(socket);

    return () => socket.close(); // Cleanup on component unmount
  }, []);

  const handleSpin = () => {
    let newRotation = Math.ceil(Math.random() * 360);
    let rotationChange = newRotation * 10;
    let updatedRotation = currentRotation + rotationChange;
    setCurrentRotation(updatedRotation);

    let actualRotation = (updatedRotation + 22.5) % 360;
    let numberOfSegments = 8;
    let segmentDegrees = 360 / numberOfSegments;

    let segmentIndex = Math.floor((360 - (actualRotation - 22.5 + 360) % 360) / segmentDegrees) % numberOfSegments;
    let segmentNumber = segmentIndex + 1;

    let segmentElement = document.querySelector(`.number[data-segment="${segmentNumber}"]`);
    let displayedSegmentNumber = segmentElement.querySelector('span').textContent;

    console.log(`Segment: ${displayedSegmentNumber}`);

    if ((segmentNumber === 4 || segmentNumber === 8) && webSocket) {
      webSocket.send(`choco: ${displayedSegmentNumber}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="relative w-96 h-96 flex items-center justify-center">
        <div
          className="absolute w-16 h-16 bg-white rounded-full z-10 flex items-center justify-center text-sm font-semibold uppercase text-gray-800 border-4 border-black cursor-pointer"
          onClick={handleSpin}
        >
          Spin
        </div>
        <div
          className="absolute w-full h-full bg-gray-800 rounded-full overflow-hidden shadow-[0_0_0_5px_rgba(51,51,51),0_0_0_15px_rgba(255,255,255),0_0_0_18px_rgba(17,17,17)] transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${currentRotation + 22.5}deg)` }}
        >
          {/* Wheel Segments */}
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 1, '--clr': '#db7093' }} data-segment="1">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 2, '--clr': '#20b2aa' }} data-segment="2">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 3, '--clr': '#d63e92' }} data-segment="3">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 4, '--clr': '#daa520' }} data-segment="4">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">🍫</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 5, '--clr': '#ff34f0' }} data-segment="5">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 6, '--clr': '#ff7f50' }} data-segment="6">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 7, '--clr': '#3cb371' }} data-segment="7">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">💩</span>
            </div>
          </div>
          <div className="number absolute w-1/2 h-1/2" style={{ '--i': 8, '--clr': '#4169e1' }} data-segment="8">
            <div className="flex justify-center items-center transform rotate-45 w-full h-full bg-[var(--clr)] clip-path-[polygon(0_0,56%_0,100%_100%,0_56%)]">
              <span className="text-white text-2xl font-bold drop-shadow-md">🍫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
