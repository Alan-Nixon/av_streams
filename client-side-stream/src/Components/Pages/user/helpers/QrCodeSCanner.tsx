import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import NavBar from '../layout/NavBar';
import { useNavigate } from 'react-router-dom';

const QrCodeScanner = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const qrScanner = new QrScanner(videoElement, result => navigate(result.data), { returnDetailedScanResult: true });
      qrScanner.start().catch(err => setError(`Error starting QR Scanner: ${err.message}`));
      return () => { qrScanner.stop() };
    }

  }, []);

  return (<>
    <NavBar />
    <div className='mt-20'>
      <h2 className='text-white text-xl text-center' >Scan Qr code to get the channel</h2>
      <div className='w-[100%] top-2'>
        <video ref={videoRef} className='ml-3 mr-3 top-0' style={{ width: '100%', height: '300px' }} />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  </>
  );
};

export default QrCodeScanner;
