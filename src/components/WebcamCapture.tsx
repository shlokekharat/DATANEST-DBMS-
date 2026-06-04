import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, X, Check, Video, VideoOff, ShieldAlert, Sparkles, Smile } from 'lucide-react';

interface WebcamCaptureProps {
  onClose: () => void;
  onSave: (photoDataUrl: string) => Promise<void>;
  currentPhoto: string | null;
}

export default function WebcamCapture({ onClose, onSave, currentPhoto }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<PermissionState | 'unknown'>('unknown');

  // Query permissions and list available camera input devices
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const requestAndEnumerateDevices = async () => {
      setIsInitializing(true);
      setCameraError(null);
      try {
        // Prompt for camera permissions by initiating a simple audio/video request
        const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
        activeStream = initialStream;
        setPermissionState('granted');
        
        // Enumerate devices once permission is validated
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoInputs);
        
        if (videoInputs.length > 0) {
          setSelectedDeviceId(videoInputs[0].deviceId);
        }
      } catch (err: any) {
        console.error("Camera permissions / enumeration error", err);
        setPermissionState('denied');
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError("Camera permission request was denied. Please update your browser permission preferences to authorize webcam access.");
        } else {
          setCameraError(`Unable to initialize webcam: ${err.message || 'Unknown device error'}`);
        }
      } finally {
        // Clean up initial stream used to prompt permission
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
        setIsInitializing(false);
      }
    };

    requestAndEnumerateDevices();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync camera track to the selected device
  useEffect(() => {
    if (!selectedDeviceId || capturedImage) return;

    let activeStream: MediaStream | null = null;

    const activateCameraDevice = async () => {
      setIsInitializing(true);
      setCameraError(null);
      // Clean up previous stream state
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      try {
        const constraints = {
          video: {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: 640 },
            height: { ideal: 640 },
            aspectRatio: { ideal: 1 }
          }
        };
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = newStream;
        setStream(newStream);

        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(e => console.error("Video play failed:", e));
          };
        }
      } catch (err: any) {
        console.error("Error linking webcam source track:", err);
        setCameraError(`Failed to bind video stream from this camera: ${err.message || 'hardware busy or restricted'}`);
      } finally {
        setIsInitializing(false);
      }
    };

    activateCameraDevice();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedDeviceId, capturedImage]);

  // Clean up stream on unmounting
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Create a square image for student profiles
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    const size = Math.min(videoWidth, videoHeight);

    canvas.width = 400;
    canvas.height = 400;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Crop to a neat center square
      const sourceX = (videoWidth - size) / 2;
      const sourceY = (videoHeight - size) / 2;
      
      // Perform crop & downscale onto high-res 400x400 layout
      ctx.drawImage(
        video, 
        sourceX, sourceY, size, size, // Source rect
        0, 0, 400, 400               // Dest rect
      );

      // Support canvas-based filters if needed, keep standard clean JPEG
      const snapshotUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedImage(snapshotUrl);

      // Turn off camera stream tracks temporarily to preserve device power/life
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    // Restart camera on the currently selected device
    if (selectedDeviceId) {
      setIsInitializing(true);
      // Let the useEffect trigger re-acquisition
      const cached = selectedDeviceId;
      setSelectedDeviceId('');
      setTimeout(() => setSelectedDeviceId(cached), 50);
    }
  };

  const handleCommitImage = async () => {
    if (!capturedImage) return;
    setIsSaving(true);
    try {
      await onSave(capturedImage);
      onClose();
    } catch (err) {
      console.error("Save image failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="webcam-capture-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Head Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-150 dark:border-slate-850 bg-gray-50/50 dark:bg-slate-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-display font-extrabold text-gray-900 dark:text-white leading-tight">
                Secure Academic Photo Feed
              </h3>
              <p className="text-[10px] font-mono text-gray-400">
                DBMS Operational Profile Integration
              </p>
            </div>
          </div>
          <button
            id="webcam-modal-close"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Media Body Block */}
        <div className="p-6 flex flex-col items-center">
          
          <div className="relative w-full aspect-square max-w-[320px] bg-slate-950 rounded-2xl overflow-hidden border border-gray-250 dark:border-slate-800 shadow-inner flex items-center justify-center group">
            
            <AnimatePresence mode="wait">
              {/* Captured Preview State */}
              {capturedImage ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10"
                >
                  <img
                    src={capturedImage}
                    alt="Captured student portrait"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow flex items-center space-x-1 uppercase tracking-wider animate-pulse">
                    <Check className="w-3 h-3" />
                    <span>Snapshot Acquired</span>
                  </div>
                </motion.div>
              ) : cameraError ? (
                /* Access Error / Preference Restriction State */
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 text-center text-red-500 dark:text-red-400 space-y-3 flex flex-col items-center justify-center h-full"
                >
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-650 rounded-full border border-red-200">
                    <VideoOff className="w-6 h-6 animate-bounce" />
                  </div>
                  <p className="text-xs font-semibold max-w-[240px] leading-relaxed">
                    {cameraError}
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-[220px]">
                    Ensure that no other process is utilizing your camera and that permissions are allowed.
                  </p>
                </motion.div>
              ) : (
                /* Live Camera Stream Feed */
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-950"
                >
                  {isInitializing && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950 space-y-2 text-white">
                      <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
                      <p className="text-[10px] font-mono text-gray-400">Locking sensor aperture...</p>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  {/* Camera Aperture / Guidelines Crop Overlay */}
                  <div className="absolute inset-0 border-[24px] border-black/40 pointer-events-none flex items-center justify-center">
                    {/* Ring helper overlay to guide alignment */}
                    <div className="w-full h-full rounded-full border-2 border-dashed border-blue-400/40 opacity-70 flex items-center justify-center">
                      {/* Crosshair target centers */}
                      <div className="w-6 h-0.5 bg-blue-500/30 absolute" />
                      <div className="h-6 w-0.5 bg-blue-500/30 absolute" />
                      
                      <div className="absolute bottom-2 font-sans text-[8px] uppercase tracking-widest text-blue-300 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur">
                        Center Face In Circle
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Camera Selector drop-down menu */}
          {!capturedImage && devices.length > 1 && (
            <div id="camera-selector-pane" className="w-full max-w-[320px] mt-4 space-y-1">
              <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">
                Select Camera Source
              </label>
              <div className="relative">
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-950 text-xs text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition cursor-pointer appearance-none"
                >
                  {devices.map((device, idx) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera ${idx + 1}`}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-450 text-[10px] font-mono">
                  ▼
                </div>
              </div>
            </div>
          )}

          {/* Instructional notes in capturing portal */}
          <div className="w-full max-w-[320px] mt-4 bg-gray-50 dark:bg-slate-950 border border-gray-150 dark:border-slate-850 p-3 rounded-xl flex items-start space-x-2">
            <Smile className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
              Keep standard lighting, maintain composure, and click <b>Capture Snapshot</b>. The image will instantly become your administrator profile credential.
            </p>
          </div>

        </div>

        {/* Action Controls Bar */}
        <div className="px-6 py-4 border-t border-gray-150 dark:border-slate-850 bg-gray-50/50 dark:bg-slate-950/40 flex items-center justify-end space-x-3">
          <button
            id="webcam-action-cancel"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>

          {capturedImage ? (
            <>
              <button
                id="webcam-action-retake"
                onClick={handleRetake}
                className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-850 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>
              
              <button
                id="webcam-action-save"
                onClick={handleCommitImage}
                disabled={isSaving}
                className="px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-55"
              >
                {isSaving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Save Profile Photo</span>
              </button>
            </>
          ) : (
            <button
              id="webcam-action-capture"
              onClick={handleCapturePhoto}
              disabled={isInitializing || !!cameraError}
              className="px-4.5 py-2 bg-gradient-to-r from-blue-650 to-indigo-600 hover:opacity-90 hover:shadow text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer disabled:opacity-40"
            >
              <Video className="w-4 h-4 animate-pulse" />
              <span>Capture Snapshot</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
