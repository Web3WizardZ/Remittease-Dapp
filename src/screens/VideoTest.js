// src/screens/VideoTest.js
import React from 'react';

const VideoTest = () => {
  return (
    <div>
      <video autoPlay muted loop style={{ width: '100%', height: '100vh' }}>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoTest;
