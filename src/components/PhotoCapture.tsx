import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

interface PhotoCaptureProps {
  materialType: string;
  userId: string;
  onPhotoUploaded: (url: string) => void;
  onClose?: () => void;
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  materialType,
  userId,
  onPhotoUploaded,
  onClose
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { uploadPhoto, uploadProgress, validateFile, isDemo } = usePhotoUpload();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Tentar usar câmera traseira
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Tente fazer upload de uma foto existente.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        
        // Converter para File object
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFile(file);
          }
        }, 'image/jpeg', 0.8);
        
        stopCamera();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setSelectedFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadPhoto(selectedFile, materialType, userId);
    
    if (result.success && result.url) {
      onPhotoUploaded(result.url);
      resetState();
    } else {
      alert(result.error || 'Erro no upload da foto');
    }
  };

  const resetState = () => {
    setCapturedImage(null);
    setSelectedFile(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg">Fotografar Material</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Material Info */}
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Material:</strong> {materialType}
            </p>
            {isDemo && (
              <p className="text-xs text-green-600 mt-1">
                ℹ️ Modo demonstração - fotos simuladas
              </p>
            )}
          </div>

          {/* Camera View */}
          {showCamera && (
            <div className="mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border"
                style={{ maxHeight: '300px' }}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
                >
                  <Camera className="w-4 h-4" />
                  Capturar Foto
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Preview da Foto */}
          {capturedImage && (
            <div className="mb-4">
              <img
                src={capturedImage}
                alt="Preview"
                className="w-full rounded-lg border max-h-64 object-cover"
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploadProgress.isUploading && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">
                  Enviando foto... {uploadProgress.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!showCamera && !capturedImage && (
            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <Camera className="w-5 h-5" />
                Usar Câmera
              </button>
              
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50"
                >
                  <Upload className="w-5 h-5" />
                  Escolher da Galeria
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
              </div>
            </div>
          )}

          {/* Upload Actions */}
          {capturedImage && selectedFile && (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploadProgress.isUploading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                {uploadProgress.isUploading ? 'Enviando...' : 'Confirmar Upload'}
              </button>
              <button
                onClick={resetState}
                disabled={uploadProgress.isUploading}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Nova Foto
              </button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};