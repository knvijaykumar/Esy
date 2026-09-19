import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Zap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Send,
  ArrowLeft,
  RefreshCw,
  Wheat,
  MapPin,
  Ticket,
  User,
  Info,
  Printer,
  Sparkles,
  AlertCircle,
  X,
  Download,
  Eye,
  FileCheck,
} from 'lucide-react';
import { Farmer, Booking, ProcurementCenter, CropCondition, CropAssessmentResult, CropAssessmentReport } from '../../types';
import { mockService } from '../../services/mockService';
import { cropAssessmentService } from '../../services/cropAssessmentService';

interface CropAssessmentPageProps {
  farmer: Farmer;
  activeBooking?: Booking;
  onNavigate: (route: string) => void;
  onBack: () => void;
}

export const CropAssessmentPage: React.FC<CropAssessmentPageProps> = ({
  farmer,
  activeBooking,
  onNavigate,
  onBack,
}) => {
  // Step state: 'capture' | 'results' | 'review' | 'submitted'
  const [currentStep, setCurrentStep] = useState<'capture' | 'results' | 'review' | 'submitted'>('capture');

  // Image state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageCropHint, setImageCropHint] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Processing state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgressText, setAnalysisProgressText] = useState<string>('Analyzing crop image...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Analysis result
  const [result, setResult] = useState<CropAssessmentResult | null>(null);

  // Report state
  const [report, setReport] = useState<CropAssessmentReport | null>(null);

  // Selected centre state for submission
  const [availableCenters, setAvailableCenters] = useState<ProcurementCenter[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // PDF Receipt copy state
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [receiptNumber, setReceiptNumber] = useState<string>(
    () => `REC-AI-${Math.floor(100000 + Math.random() * 900000)}`
  );

  // Hidden file input for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Camera State & Device Management
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableVideoDevices, setAvailableVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Load available procurement centres
  useEffect(() => {
    const centers = mockService.getAllCenters();
    setAvailableCenters(centers);

    // Default to active booking's centre or the first centre matching farmer's district
    if (activeBooking?.center_id) {
      setSelectedCenterId(activeBooking.center_id);
    } else if (farmer?.district_id) {
      const matched = centers.find((c) => c.district_id === farmer.district_id);
      if (matched) {
        setSelectedCenterId(matched.id);
      } else if (centers.length > 0) {
        setSelectedCenterId(centers[0].id);
      }
    } else if (centers.length > 0) {
      setSelectedCenterId(centers[0].id);
    }
  }, [activeBooking, farmer]);

  // Stop live camera media stream
  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Stop camera and close viewfinder
  const stopCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Ensure live video stream attaches properly whenever isCameraOpen becomes true
  useEffect(() => {
    if (isCameraOpen && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraOpen]);

  // Start live camera stream with facingMode (environment = back, user = front) or specific deviceId
  const startCamera = async (facingMode: 'environment' | 'user' = 'environment', deviceId?: string) => {
    stopCameraStream();
    setIsCameraOpen(true);
    setCameraLoading(true);
    setCameraError(null);
    setCameraFacingMode(facingMode);
    if (deviceId) setSelectedDeviceId(deviceId);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your current browser. Please use the Upload Photo option.');
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // Enumerate available video inputs for multi-camera devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setAvailableVideoDevices(videoInputs);
        if (!deviceId && videoInputs.length > 0) {
          const currentTrack = stream.getVideoTracks()[0];
          const activeDevice = videoInputs.find(
            (d) => d.label === currentTrack.label || d.deviceId === currentTrack.getSettings()?.deviceId
          );
          if (activeDevice) setSelectedDeviceId(activeDevice.deviceId);
        }
      } catch {
        // Enumerate devices failure is non-critical
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      let msg = 'Could not access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera access in your browser address bar/settings, or use Upload Photo.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera device found on this system. Please connect a webcam or use Upload Photo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is currently in use by another application. Please close other camera apps and try again.';
      } else if (err.message) {
        msg = err.message;
      }
      setCameraError(msg);
    } finally {
      setCameraLoading(false);
    }
  };

  // Capture high-resolution snapshot from video onto canvas
  const handleCaptureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Flip horizontally if front camera for natural mirroring
      if (cameraFacingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      setImagePreview(dataUrl);
      setFileName(`crop-camera-${Date.now()}.jpg`);
      setImageCropHint('');
      setErrorMessage(null);
      stopCamera();
    } catch (err) {
      console.error('Snapshot capture error:', err);
      setCameraError('Failed to capture snapshot from camera. Please try again or use Upload Photo.');
    }
  };

  // Handle file selection (upload photo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate that file is an image
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 10MB. Please select a smaller photo.');
      return;
    }

    setFileName(file.name);
    setImageCropHint('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try selecting again.');
    };
    reader.readAsDataURL(file);
  };


  // Trigger analysis
  const handleAnalyzeCrop = async () => {
    if (!imagePreview) {
      setErrorMessage('Please capture or upload a clear photo of your crop first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Cycle friendly progress messages
    const progressMessages = [
      'Scanning crop image...',
      'Analyzing grain structure & foliage...',
      'Checking for disease signs & quality markers...',
      'Evaluating condition against Karnataka FAQ standards...',
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % progressMessages.length;
      setAnalysisProgressText(progressMessages[msgIdx]);
    }, 600);

    try {
      const assessment = await cropAssessmentService.analyzeCrop({
        image: imagePreview,
        crop_hint: imageCropHint,
      });
      clearInterval(interval);
      setResult(assessment);
      const newRecNum = `REC-AI-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptNumber(newRecNum);
      setCurrentStep('results');
    } catch (err: any) {
      clearInterval(interval);
      // Clean farmer-friendly error message
      setErrorMessage(
        err.message || 'Could not analyze the photo. Please ensure the image is clear and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset/Retake Photo
  const handleReset = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setImagePreview(null);
    setImageCropHint('');
    setFileName('');
    setResult(null);
    setReport(null);
    setErrorMessage(null);
    setCurrentStep('capture');
  };

  // Step 4: Generate Crop Report
  const handleGenerateReport = () => {
    if (!result) return;

    const matchedCenter = availableCenters.find((c) => c.id === selectedCenterId);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newReport: CropAssessmentReport = {
      id: `CR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      farmer_id: farmer.id || farmer.farmer_id,
      farmer_name: farmer.full_name,
      farmer_mobile: farmer.mobile,
      crop: result.crop,
      disease_or_issue: result.disease_or_issue,
      condition: result.condition,
      quality_warning: result.quality_warning,
      recommendation: result.recommendation,
      analysis_date: formattedDate,
      center_id: matchedCenter?.id,
      center_name: matchedCenter?.name,
      token_number: activeBooking?.token_number,
      booking_date: activeBooking?.date,
      image_preview: imagePreview || undefined,
      submitted_to_center: false,
    };

    setReport(newReport);
    setCurrentStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 5: Send to Selected Centre
  const handleConfirmSend = () => {
    if (!report) return;
    setIsSending(true);

    const matchedCenter = availableCenters.find((c) => c.id === selectedCenterId);
    const updatedReport: CropAssessmentReport = {
      ...report,
      center_id: matchedCenter?.id || report.center_id,
      center_name: matchedCenter?.name || report.center_name,
      submitted_to_center: true,
      submitted_at: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    // Save to mockService storage
    mockService.saveCropAssessmentReport(updatedReport);
    setReport(updatedReport);

    setTimeout(() => {
      setIsSending(false);
      setShowConfirmModal(false);
      setCurrentStep('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  // Generate & Print Official PDF Receipt Copy
  const handlePrintPdfReceipt = () => {
    const matchedCenter = availableCenters.find((c) => c.id === selectedCenterId) || availableCenters[0];
    const recId = receiptNumber || report?.id || `REC-AI-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const activeCrop = result?.crop || report?.crop || 'Paddy';
    const activeCondition = result?.condition || report?.condition || 'Healthy';
    const activeIssue = result?.disease_or_issue || report?.disease_or_issue || 'None Detected (Clean Sample)';
    const activeWarning = result?.quality_warning || report?.quality_warning || 'Within FAQ limits';
    const activeAdvice = result?.recommendation || report?.recommendation || 'Approved for intake';

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Crop_Assessment_Receipt_${recId}</title>
          <style>
            @page { size: auto; margin: 12mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 16px;
              line-height: 1.4;
            }
            .receipt-box {
              max-width: 650px;
              margin: 0 auto;
              border: 2px solid #0f172a;
              padding: 24px;
              border-radius: 8px;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #0f172a;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }
            .title {
              font-size: 18px;
              font-weight: 800;
              text-transform: uppercase;
              color: #15803d;
              margin: 0;
            }
            .subtitle {
              font-size: 12px;
              color: #475569;
              margin: 2px 0 0 0;
            }
            .receipt-pill {
              display: inline-block;
              background: #f1f5f9;
              border: 1px solid #cbd5e1;
              padding: 4px 10px;
              border-radius: 4px;
              font-weight: 700;
              font-family: monospace;
              font-size: 13px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #334155;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 4px;
              margin: 14px 0 8px 0;
            }
            table.data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 12px;
            }
            table.data-table th, table.data-table td {
              padding: 6px 8px;
              font-size: 12px;
              text-align: left;
              border-bottom: 1px solid #f1f5f9;
            }
            table.data-table th {
              color: #64748b;
              width: 38%;
              font-weight: 600;
            }
            table.data-table td {
              color: #0f172a;
              font-weight: 700;
            }
            .condition-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 800;
              font-size: 11px;
              background: ${activeCondition === 'Healthy' ? '#dcfce7' : activeCondition === 'Moderate' ? '#fef3c7' : '#fee2e2'};
              color: ${activeCondition === 'Healthy' ? '#166534' : activeCondition === 'Moderate' ? '#92400e' : '#991b1b'};
            }
            .security-box {
              background: #f8fafc;
              border: 1px dashed #94a3b8;
              border-radius: 6px;
              padding: 10px;
              margin-top: 14px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 11px;
            }
            .barcode {
              font-family: monospace;
              font-size: 18px;
              letter-spacing: 4px;
              font-weight: bold;
            }
            .disclaimer {
              margin-top: 12px;
              font-size: 10px;
              color: #64748b;
              line-height: 1.3;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              .receipt-box { border: 1.5px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <table class="header-table">
              <tr>
                <td>
                  <h1 class="title">Bharat Krishi Seva • Esy FARM</h1>
                  <p class="subtitle">Government of Karnataka — APMC Digital Support Initiative</p>
                  <p class="subtitle"><strong>AI Crop Quality Assessment & Intake Slip</strong></p>
                </td>
                <td style="text-align: right;">
                  <div class="receipt-pill">REC: ${recId}</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${now}</div>
                </td>
              </tr>
            </table>

            <div class="section-title">Farmer Identity & Origin</div>
            <table class="data-table">
              <tr>
                <th>Farmer Name:</th>
                <td>${farmer.full_name} (${farmer.farmer_id || 'KA-FMR-2026-001'})</td>
              </tr>
              <tr>
                <th>Contact Mobile:</th>
                <td>+91 ${farmer.mobile}</td>
              </tr>
              <tr>
                <th>Village & Taluk:</th>
                <td>${farmer.village || 'Santhebennur'}, Channagiri Taluk, Davanagere</td>
              </tr>
            </table>

            <div class="section-title">Quick AI Scan & Grain Quality Assessment</div>
            <table class="data-table">
              <tr>
                <th>Scanned Crop:</th>
                <td>${activeCrop} (${Math.round((result?.crop_confidence || 0.94) * 100)}% Match Confidence)</td>
              </tr>
              <tr>
                <th>Quality Condition:</th>
                <td><span class="condition-badge">${activeCondition.toUpperCase()} QUALITY</span></td>
              </tr>
              <tr>
                <th>Detected Issue / Defect:</th>
                <td>${activeIssue}</td>
              </tr>
              <tr>
                <th>Quality Warning / Moisture:</th>
                <td>${activeWarning}</td>
              </tr>
              <tr>
                <th>Mandi Intake Recommendation:</th>
                <td>${activeAdvice}</td>
              </tr>
            </table>

            <div class="section-title">Designated Procurement Centre Destination</div>
            <table class="data-table">
              <tr>
                <th>Designated APMC Yard:</th>
                <td>${matchedCenter?.name || 'Channagiri Procurement Centre'}</td>
              </tr>
              <tr>
                <th>Physical Address:</th>
                <td>${matchedCenter?.address || 'APMC Yard, Channagiri'}</td>
              </tr>
              <tr>
                <th>Operational Timing:</th>
                <td>${matchedCenter?.operating_hours || '08:30 AM – 05:30 PM'}</td>
              </tr>
            </table>

            <div class="security-box">
              <div style="flex: 1 1 auto; min-width: 0;">
                <svg width="155" height="26" viewBox="0 0 155 26" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                  <rect x="0" y="0" width="2.5" height="26" fill="#0f172a" />
                  <rect x="5" y="0" width="1.5" height="26" fill="#0f172a" />
                  <rect x="9" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="14" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="18" y="0" width="4" height="26" fill="#0f172a" />
                  <rect x="24" y="0" width="1.5" height="26" fill="#0f172a" />
                  <rect x="28" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="33" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="37" y="0" width="4" height="26" fill="#0f172a" />
                  <rect x="43" y="0" width="1.5" height="26" fill="#0f172a" />
                  <rect x="47" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="52" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="56" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="60" y="0" width="3.5" height="26" fill="#0f172a" />
                  <rect x="66" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="70" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="75" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="79" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="83" y="0" width="3.5" height="26" fill="#0f172a" />
                  <rect x="89" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="93" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="96" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="101" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="105" y="0" width="4" height="26" fill="#0f172a" />
                  <rect x="111" y="0" width="1.5" height="26" fill="#0f172a" />
                  <rect x="115" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="120" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="124" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="128" y="0" width="3.5" height="26" fill="#0f172a" />
                  <rect x="134" y="0" width="2" height="26" fill="#0f172a" />
                  <rect x="138" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="143" y="0" width="1" height="26" fill="#0f172a" />
                  <rect x="147" y="0" width="3" height="26" fill="#0f172a" />
                  <rect x="152" y="0" width="2" height="26" fill="#0f172a" />
                </svg>
                <div style="font-size: 10px; color: #475569; margin-top: 4px; font-family: monospace; font-weight: 600; white-space: nowrap;">TOKEN: ${recId}</div>
              </div>
              <div style="text-align: right; flex-shrink: 0; white-space: nowrap;">
                <div style="font-weight: 800; color: #166534; font-size: 11px; white-space: nowrap;">✓ VERIFIED AI PRE-INSPECTION</div>
                <div style="color: #64748b; font-size: 10px; margin-top: 2px; white-space: nowrap;">Esy FARM Quality Engine v2.6</div>
              </div>
            </div>

            <p class="disclaimer">
              Notice: This is an official preliminary AI-assisted crop assessment slip. The final quality grade, physical weighment, and DBT procurement approval are conducted at the designated APMC centre. Present this slip or digital token at gate security.
            </p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Download Plain Text / Offline Slip
  const handleDownloadTextSlip = () => {
    const matchedCenter = availableCenters.find((c) => c.id === selectedCenterId) || availableCenters[0];
    const recId = receiptNumber || report?.id || `REC-AI-${Math.floor(100000 + Math.random() * 900000)}`;
    const activeCrop = result?.crop || report?.crop || 'Paddy';
    const activeCondition = result?.condition || report?.condition || 'Healthy';
    const activeIssue = result?.disease_or_issue || report?.disease_or_issue || 'None Detected';
    const activeWarning = result?.quality_warning || report?.quality_warning || 'FAQ Compliant';
    const activeAdvice = result?.recommendation || report?.recommendation || 'Approved for intake';

    const content = `===============================================================
BHARAT KRISHI SEVA (BKS) — ESY FARM
OFFICIAL AI CROP QUALITY ASSESSMENT RECEIPT (SLIP)
===============================================================
RECEIPT NUMBER   : ${recId}
ISSUE DATE & TIME: ${new Date().toLocaleString('en-IN')}
---------------------------------------------------------------
FARMER NAME      : ${farmer.full_name}
FARMER ID        : ${farmer.farmer_id || 'KA-FMR-2026-001'}
CONTACT MOBILE   : +91 ${farmer.mobile}
VILLAGE          : ${farmer.village || 'Santhebennur'}
---------------------------------------------------------------
CROP SCANNED     : ${activeCrop}
ASSESSMENT RESULT: ${activeCondition.toUpperCase()} QUALITY
AI CONFIDENCE    : ${Math.round((result?.crop_confidence || 0.94) * 100)}%
ISSUE / DEFECT   : ${activeIssue}
QUALITY WARNING  : ${activeWarning}
RECOMMENDATION   : ${activeAdvice}
---------------------------------------------------------------
DESTINATION YARD : ${matchedCenter?.name || 'Procurement Centre'}
YARD ADDRESS     : ${matchedCenter?.address || 'APMC Yard'}
OPERATING HOURS  : ${matchedCenter?.operating_hours || '08:30 AM – 05:30 PM'}
===============================================================
STATUS           : VERIFIED DIGITAL PRE-INSPECTION SLIP
Present this slip at Mandi Gate for priority bay queue intake.
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Crop_Assessment_Receipt_${recId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for condition badge styling
  const getConditionStyle = (condition: CropCondition) => {
    switch (condition) {
      case 'Healthy':
        return {
          bg: '#ecfdf5',
          text: '#065f46',
          border: '#a7f3d0',
          badgeClass: 'badge-confirmed',
          label: 'Healthy (Good Quality)',
        };
      case 'Moderate':
        return {
          bg: '#fffbeb',
          text: '#92400e',
          border: '#fef3c7',
          badgeClass: 'badge-pending',
          label: 'Moderate (Needs Checking)',
        };
      case 'Poor':
        return {
          bg: '#fef2f2',
          text: '#991b1b',
          border: '#fecaca',
          badgeClass: 'badge-cancelled',
          label: 'Poor (High Quality Risk)',
        };
      default:
        return {
          bg: '#f8fafc',
          text: '#334155',
          border: '#e2e8f0',
          badgeClass: 'badge-crop',
          label: condition,
        };
    }
  };

  const selectedCenter = availableCenters.find((c) => c.id === selectedCenterId);

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Navigation & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={onBack}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              background: '#ffedd5',
              color: '#ea580c',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Zap size={14} />
            <span>AI Crop Assessment</span>
          </span>
        </div>
      </div>

      {/* Main Feature Title Card */}
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--color-primary)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
              Quick Crop Assessment
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              Capture or upload a clear photo of your crop for an instant AI-based preliminary assessment.
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert (Farmer-friendly) */}
      {errorMessage && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.925rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: CAPTURE & UPLOAD */}
      {currentStep === 'capture' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Subtitle / Instructions */}
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              Capture or upload a clear photo of your crop
            </h2>
            <p style={{ fontSize: '0.9rem' }}>
              Ensure good lighting and hold the camera close to the crop grain or foliage for the most accurate assessment.
            </p>
          </div>

          {/* Hidden File Input for Upload */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Action Buttons: Capture Photo (Opens Live Camera) & Upload Photo */}
          <div className="grid-2" style={{ gap: '1rem' }}>
            <button
              type="button"
              onClick={() => startCamera('environment')}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1.1rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                border: isCameraOpen ? '2px solid #16a34a' : '2px solid var(--color-border)',
                background: isCameraOpen ? '#f0fdf4' : '#ffffff',
                color: isCameraOpen ? '#166534' : 'var(--color-text-main)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Open device camera to capture photo"
            >
              <Camera size={22} color="var(--color-primary)" />
              <span>📷 Capture Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                stopCamera();
                fileInputRef.current?.click();
              }}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1.1rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                border: '2px solid var(--color-border)',
                background: '#ffffff',
                cursor: 'pointer',
              }}
              title="Upload photo from device folder"
            >
              <Upload size={22} color="var(--color-secondary)" />
              <span>📁 Upload Photo</span>
            </button>
          </div>

          {/* LIVE CAMERA VIEWFINDER (Opens upon clicking Capture Photo) */}
          {isCameraOpen && (
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.25)',
                border: '1.5px solid #334155',
              }}
            >
              {/* Camera Header & Mode Switcher */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  borderBottom: '1px solid #1e293b',
                  paddingBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      display: 'inline-block',
                      boxShadow: '0 0 8px #22c55e',
                    }}
                  />
                  <strong style={{ fontSize: '1rem', letterSpacing: '0.01em' }}>
                    Live Camera Viewfinder
                  </strong>
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    {cameraFacingMode === 'environment' ? 'Back Camera (Rear)' : 'Front Camera (Selfie)'}
                  </span>
                </div>

                {/* Back / Front Camera Toggle Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => startCamera('environment')}
                    className="btn btn-sm"
                    style={{
                      background: cameraFacingMode === 'environment' ? '#16a34a' : 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      border: cameraFacingMode === 'environment' ? '1.5px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title="Switch to Back / Rear camera (Recommended for crops)"
                  >
                    <Camera size={15} />
                    <span>Back Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('user')}
                    className="btn btn-sm"
                    style={{
                      background: cameraFacingMode === 'user' ? '#16a34a' : 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      border: cameraFacingMode === 'user' ? '1.5px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    title="Switch to Front / Selfie camera"
                  >
                    <User size={15} />
                    <span>Front Camera</span>
                  </button>

                  {/* Close Camera View */}
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#fca5a5',
                      border: '1px solid #ef4444',
                      borderRadius: '20px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                    title="Cancel and close camera"
                  >
                    <X size={15} />
                    <span>Close</span>
                  </button>
                </div>
              </div>

              {/* Specific Camera Device Selector (if multiple hardware cameras detected) */}
              {availableVideoDevices.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.825rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#94a3b8' }}>Switch Hardware Device:</span>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => startCamera(cameraFacingMode, e.target.value)}
                    style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      border: '1px solid #475569',
                      borderRadius: '6px',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.825rem',
                    }}
                  >
                    {availableVideoDevices.map((dev, idx) => (
                      <option key={dev.deviceId || idx} value={dev.deviceId}>
                        {dev.label || `Camera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Video Viewport Area */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxHeight: '400px',
                  minHeight: '260px',
                  background: '#020617',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cameraLoading && (
                  <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
                    <RefreshCw size={30} className="spin-icon" />
                    <span style={{ fontSize: '0.9rem' }}>Initializing {cameraFacingMode === 'environment' ? 'Back' : 'Front'} Camera...</span>
                  </div>
                )}

                {cameraError ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#fca5a5', maxWidth: '500px' }}>
                    <AlertCircle size={36} style={{ margin: '0 auto 0.5rem', display: 'block', color: '#ef4444' }} />
                    <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', lineHeight: 1.4 }}>{cameraError}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => startCamera(cameraFacingMode)}
                        className="btn btn-sm"
                        style={{ background: '#ffffff', color: '#0f172a', fontWeight: 700 }}
                      >
                        Retry Camera
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          fileInputRef.current?.click();
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        Upload Photo Instead
                      </button>
                    </div>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      maxHeight: '400px',
                      objectFit: 'cover',
                      transform: cameraFacingMode === 'user' ? 'scaleX(-1)' : 'none',
                      borderRadius: '12px',
                    }}
                  />
                )}

                {/* Viewfinder Target Framing Overlay */}
                {!cameraError && !cameraLoading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '20px',
                      border: '2px dashed rgba(255, 255, 255, 0.45)',
                      borderRadius: '12px',
                      pointerEvents: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                      <span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                        🌾 Crop Target Area
                      </span>
                      <span style={{ background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                        {cameraFacingMode === 'environment' ? '📷 Back Camera' : '🤳 Front Camera'}
                      </span>
                    </div>

                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.95)',
                        background: 'rgba(0, 0, 0, 0.65)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        alignSelf: 'center',
                        fontWeight: 600,
                      }}
                    >
                      Hold steady close to crop grain or leaves with good light
                    </div>
                  </div>
                )}
              </div>

              {/* Snap Action Button */}
              {!cameraError && !cameraLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', paddingTop: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="btn btn-primary btn-lg"
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff',
                      padding: '0.85rem 2.25rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      boxShadow: '0 4px 18px rgba(22, 163, 74, 0.45)',
                      cursor: 'pointer',
                    }}
                  >
                    <Camera size={22} />
                    <span>Snap & Use Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Image Preview Area */}
          {imagePreview ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                background: '#ffffff',
                border: '1.5px solid var(--color-primary-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  Image Preview
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline btn-sm"
                  style={{ color: '#b91c1c', borderColor: '#fecaca', fontSize: '0.8rem' }}
                >
                  Remove / Retake
                </button>
              </div>

              <div
                style={{
                  maxHeight: '320px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f1f5f9',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }}
                />
              </div>

              {fileName && (
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  Selected file: <strong>{fileName}</strong>
                </div>
              )}

              {/* Analyze Crop Button */}
              <button
                type="button"
                onClick={handleAnalyzeCrop}
                disabled={isAnalyzing}
                className="btn btn-primary btn-lg btn-block"
                style={{ marginTop: '0.5rem' }}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={20} className="spin-icon" />
                    <span>{analysisProgressText}</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Analyze Crop</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1rem',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
              }}
            >
              <Wheat size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                No crop photo selected yet
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                Use the buttons above to capture or select a photo of your harvest.
              </div>
            </div>
          )}

          {/* Clean Loading Spinner Overlay while Analyzing */}
          {isAnalyzing && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1.5px solid var(--color-primary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #bbf7d0',
                  borderTopColor: 'var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1rem' }}>
                {analysisProgressText}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Please wait while the preliminary quality assessment is completed.
              </div>
            </div>
          )}

          {/* Mandatory Disclaimer */}
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              background: '#f8fafc',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
            }}
          >
            <Info size={16} color="var(--color-text-subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              AI-generated preliminary crop assessment. Final quality assessment and procurement decision are made at the procurement centre.
            </span>
          </div>
        </div>
      )}

      {/* STEP 2 & 3: AI ANALYSIS RESULTS */}
      {currentStep === 'results' && result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Scan Complete • PDF Receipt Slip Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1.5px solid #86efac',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: '#16a34a',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                  flexShrink: 0,
                }}
              >
                <FileCheck size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#14532d' }}>
                    Quick Scan Completed!
                  </span>
                  <span
                    style={{
                      background: '#dcfce7',
                      color: '#15803d',
                      border: '1px solid #86efac',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    RECEIPT READY
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '2px' }}>
                  Official AI Intake Receipt Token: <strong style={{ fontFamily: 'monospace', letterSpacing: '0.04em' }}>{receiptNumber}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="btn btn-outline"
                style={{
                  borderColor: '#16a34a',
                  color: '#15803d',
                  background: '#ffffff',
                  fontWeight: 600,
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.875rem',
                }}
              >
                <Eye size={16} />
                <span>View Receipt Slip</span>
              </button>
              <button
                type="button"
                onClick={handlePrintPdfReceipt}
                className="btn btn-primary"
                style={{
                  background: '#16a34a',
                  borderColor: '#15803d',
                  color: '#ffffff',
                  fontWeight: 700,
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.875rem',
                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                }}
              >
                <Download size={16} />
                <span>Download / Print PDF Slip</span>
              </button>
            </div>
          </div>

          {/* Low Confidence Warning (if applicable) */}
          {result.crop_confidence < 0.6 && (
            <div
              style={{
                background: '#fffbeb',
                border: '1.5px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                color: '#92400e',
              }}
            >
              <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
                  Low Confidence Detection
                </strong>
                <span style={{ fontSize: '0.875rem' }}>
                  The photo may be blurry, poorly lit, or taken too far away. For best accuracy, ensure the crop is clearly visible in natural daylight. You can still review the preliminary assessment below or retake the photo.
                </span>
              </div>
            </div>
          )}

          {/* Five Results Display Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>
                  AI Analysis Results
                </h2>
                <p style={{ fontSize: '0.875rem' }}>
                  Preliminary quality markers identified from your photo.
                </p>
              </div>

              <div
                style={{
                  ...getConditionStyle(result.condition),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  border: `1.5px solid ${getConditionStyle(result.condition).border}`,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                <span>Condition: {result.condition}</span>
              </div>
            </div>

            {/* Photo Thumbnail + 5 Results Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: imagePreview ? '140px 1fr' : '1fr',
                gap: '1.25rem',
                alignItems: 'start',
              }}
            >
              {imagePreview && (
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    background: '#f8fafc',
                    maxHeight: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Analyzed crop"
                    style={{ maxWidth: '100%', maxHeight: '140px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Five Results Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* 1. Crop Identification */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase' }}>
                    🌱 Crop Identification
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
                    {result.crop}
                  </div>
                </div>

                {/* 2. Disease & Quality Issue Detection */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    🦠 Disease & Quality Issue Detection
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
                    {result.disease_or_issue}
                  </div>
                </div>

                {/* 3. Crop Condition */}
                <div
                  style={{
                    background: getConditionStyle(result.condition).bg,
                    border: `1px solid ${getConditionStyle(result.condition).border}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: getConditionStyle(result.condition).text, textTransform: 'uppercase' }}>
                    📊 Crop Condition
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: getConditionStyle(result.condition).text, marginTop: '0.2rem' }}>
                    {getConditionStyle(result.condition).label}
                  </div>
                </div>

                {/* 4. Quality Warning */}
                <div
                  style={{
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>
                    ⚠️ Quality Warning
                  </div>
                  <div style={{ fontSize: '0.925rem', color: '#7c2d12', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    {result.quality_warning}
                  </div>
                </div>

                {/* 5. Simple Recommendation */}
                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                    💡 Simple Recommendation
                  </div>
                  <div style={{ fontSize: '0.925rem', color: '#1e3a8a', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    {result.recommendation}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Generate Crop Report, PDF Receipt & Retake */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={handleGenerateReport}
                className="btn btn-primary btn-lg btn-block"
              >
                <FileText size={20} />
                <span>Generate Official Crop Report</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handlePrintPdfReceipt}
                  className="btn btn-outline"
                  style={{
                    borderColor: '#16a34a',
                    color: '#15803d',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Download size={18} />
                  <span>Download / Print PDF Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="btn btn-outline"
                  style={{
                    borderColor: '#0284c7',
                    color: '#0369a1',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Eye size={18} />
                  <span>Preview Receipt Slip</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-block"
              >
                <RefreshCw size={18} />
                <span>Analyze Another Photo</span>
              </button>
            </div>

            {/* Mandatory Disclaimer */}
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <Info size={16} color="var(--color-text-subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                AI-generated preliminary crop assessment. Final quality assessment and procurement decision are made at the procurement centre.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW REPORT */}
      {currentStep === 'review' && report && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Preliminary Quality Slip
                </span>
                <h2 style={{ fontSize: '1.5rem', margin: '0.2rem 0' }}>Review Report</h2>
                <p style={{ fontSize: '0.875rem' }}>
                  The farmer must be able to review the report before sending it to the procurement centre.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Report ID</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{report.id}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-text-subtle)' }}>{report.analysis_date}</div>
              </div>
            </div>

            {/* Farmer & Booking Details Bar */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.875rem',
              }}
            >
              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Farmer Name</div>
                <strong>{farmer.full_name}</strong> ({farmer.farmer_id || 'FMR-00125'})
              </div>

              <div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Mobile</div>
                <strong>{farmer.mobile ? `******${farmer.mobile.slice(-4)}` : '******3210'}</strong>
              </div>

              {report.token_number && (
                <div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Active Booking Token</div>
                  <strong style={{ color: 'var(--color-secondary-dark)' }}>{report.token_number}</strong>
                </div>
              )}

              {report.booking_date && (
                <div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Scheduled Date</div>
                  <strong>{report.booking_date}</strong>
                </div>
              )}
            </div>

            {/* Procurement Centre Selection & Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '2px solid #86efac',
                borderRadius: 'var(--radius-lg)',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                boxShadow: '0 2px 10px rgba(34, 197, 94, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 800, fontSize: '0.95rem' }}>
                  <MapPin size={20} color="#16a34a" />
                  <span>Destination Procurement Centre (Direct Dispatch)</span>
                </div>
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#166534',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '0.2rem 0.65rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Targeted Transmission
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                Your crop information, preliminary quality condition, and moisture observations will be routed directly to the authorized verification officers at the specific procurement centre selected below.
              </p>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="center-select" style={{ fontWeight: 700, color: '#0f172a' }}>
                  Select Procurement Centre to Receive this Crop Assessment:
                </label>
                <select
                  id="center-select"
                  className="form-control"
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                  style={{ fontWeight: 600, fontSize: '0.925rem', padding: '0.65rem 0.85rem' }}
                >
                  {availableCenters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.address}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCenter && (
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: '#166534',
                    background: '#ffffff',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    alignItems: 'center',
                  }}
                >
                  <span><strong>Assigned Yard:</strong> {selectedCenter.name}</span>
                  <span>•</span>
                  <span><strong>Timing:</strong> {selectedCenter.operating_hours}</span>
                  <span>•</span>
                  <span><strong>Contact:</strong> {selectedCenter.contact_phone}</span>
                </div>
              )}
            </div>

            {/* Structured Report Summary */}
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              <table className="table" style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <th style={{ width: '35%' }}>🌱 Crop Identification</th>
                    <td><strong>{report.crop}</strong></td>
                  </tr>
                  <tr>
                    <th>🦠 Disease / Quality Issue</th>
                    <td>{report.disease_or_issue}</td>
                  </tr>
                  <tr>
                    <th>📊 Crop Condition</th>
                    <td>
                      <span
                        className={`badge ${getConditionStyle(report.condition).badgeClass}`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {report.condition}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>⚠️ Quality Warning</th>
                    <td style={{ color: '#9a3412', fontWeight: 500 }}>{report.quality_warning}</td>
                  </tr>
                  <tr>
                    <th>💡 Recommendation</th>
                    <td style={{ color: '#1e40af' }}>{report.recommendation}</td>
                  </tr>
                  <tr>
                    <th>📅 Assessment Date & Time</th>
                    <td>{report.analysis_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mandatory Disclaimer */}
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <Info size={16} color="var(--color-text-subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                AI-generated preliminary crop assessment. Final quality assessment and procurement decision are made at the procurement centre.
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="btn btn-primary btn-lg btn-block"
              >
                <Send size={20} />
                <span>Send to Selected Centre</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentStep('results')}
                  className="btn btn-outline"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Results</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn btn-outline"
                >
                  <Printer size={16} />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: CONFIRMATION MODAL */}
      {showConfirmModal && report && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 9999,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#ffffff',
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.15rem' }}>
                  Confirm Transmission
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Send report to procurement centre
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to transmit this preliminary crop assessment report to{' '}
              <strong>{selectedCenter?.name || 'Selected Centre'}</strong>?
            </p>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}
            >
              <div><strong>Crop:</strong> {report.crop}</div>
              <div><strong>Condition:</strong> {report.condition}</div>
              <div><strong>Destination:</strong> {selectedCenter?.name || 'Procurement Centre'}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline"
                disabled={isSending}
              >
                Review Again
              </button>

              <button
                type="button"
                onClick={handleConfirmSend}
                disabled={isSending}
                className="btn btn-primary"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={16} className="spin-icon" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Yes, Send Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS CONFIRMATION MESSAGE */}
      {currentStep === 'submitted' && report && (
        <div style={{ maxWidth: '680px', margin: '0 auto', width: '100%' }}>
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '2.5rem 2rem',
              border: '2px solid var(--color-primary-border)',
            }}
          >
            {/* Success Icon */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 0 8px rgba(21, 128, 61, 0.1)',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Transmission Successful
            </div>
            <h2 style={{ fontSize: '1.85rem', margin: '0.25rem 0 0.5rem' }}>
              Crop Information Sent to Specific Procurement Centre
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
              Your crop information and preliminary quality inspection have been dispatched exclusively to{' '}
              <strong style={{ color: '#0f172a' }}>{report.center_name}</strong>. Authorized officers at this procurement centre can now review your crop parameters, disease notes, and condition grading prior to your arrival.
            </p>

            {/* Report Reference Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '2px dashed var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                ASSESSMENT REFERENCE
              </div>
              <div
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-dark)',
                  letterSpacing: '0.05em',
                  margin: '0.25rem 0',
                }}
              >
                {report.id}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#166534' }}>
                Submitted on {report.submitted_at || report.analysis_date}
              </div>
            </div>

            {/* Summary Details */}
            <div
              style={{
                textAlign: 'left',
                background: '#f8fafc',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.9rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Wheat size={18} color="var(--color-primary)" />
                <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>Crop:</span>
                <strong>{report.crop}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Sparkles size={18} color="var(--color-primary)" />
                <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>Condition:</span>
                <span className={`badge ${getConditionStyle(report.condition).badgeClass}`}>
                  {report.condition}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--color-primary)" />
                <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>Centre:</span>
                <strong>{report.center_name}</strong>
              </div>

              {report.token_number && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Ticket size={18} color="var(--color-primary)" />
                  <span style={{ color: 'var(--color-text-muted)', minWidth: '130px' }}>Token:</span>
                  <strong style={{ color: 'var(--color-secondary-dark)' }}>{report.token_number}</strong>
                </div>
              )}
            </div>

            {/* Mandatory Disclaimer */}
            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                background: '#f8fafc',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              <Info size={16} color="var(--color-text-subtle)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                AI-generated preliminary crop assessment. Final quality assessment and procurement decision are made at the procurement centre.
              </span>
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onBack}
                className="btn btn-primary btn-lg btn-block"
              >
                <span>Return to Dashboard</span>
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline"
                >
                  <RefreshCw size={16} />
                  <span>New Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintPdfReceipt}
                  className="btn btn-outline"
                  style={{
                    borderColor: '#16a34a',
                    color: '#15803d',
                    fontWeight: 600,
                  }}
                >
                  <Printer size={16} />
                  <span>Print PDF Receipt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                className="btn btn-outline btn-block"
                style={{
                  borderColor: '#0284c7',
                  color: '#0369a1',
                  fontWeight: 600,
                }}
              >
                <Eye size={16} />
                <span>View Official Receipt Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: OFFICIAL PDF RECEIPT PREVIEW SLIP */}
      {showReceiptModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
            overflowY: 'auto',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReceiptModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
            }}
          >
            {/* Modal Top Bar */}
            <div
              style={{
                background: '#0f172a',
                color: '#ffffff',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={20} color="#4ade80" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Official Assessment Receipt Slip Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Receipt Printable Slip Preview Body */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                background: '#f8fafc',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '2px solid #0f172a',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                }}
              >
                {/* Header */}
                <div
                  style={{
                    borderBottom: '2px solid #0f172a',
                    paddingBottom: '0.85rem',
                    marginBottom: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        color: '#15803d',
                        textTransform: 'uppercase',
                        margin: 0,
                        letterSpacing: '0.02em',
                      }}
                    >
                      Bharat Krishi Seva • Esy FARM
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#475569', margin: '2px 0 0 0' }}>
                      Govt of Karnataka — APMC Digital Support Initiative
                    </p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                      AI Crop Quality Assessment & Intake Slip
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        display: 'inline-block',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: '#0f172a',
                      }}
                    >
                      {receiptNumber}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px' }}>
                      {new Date().toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                {/* Section: Farmer Identity */}
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#475569',
                    letterSpacing: '0.05em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Farmer Identity & Origin
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.6rem 0.8rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Farmer Name:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {farmer.full_name} ({farmer.farmer_id || 'KA-FMR-2026-001'})
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Registered Mobile:</span>
                    <strong style={{ color: '#0f172a' }}>+91 {farmer.mobile}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Origin Village:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {farmer.village || 'Santhebennur'}, Channagiri Taluk
                    </strong>
                  </div>
                </div>

                {/* Section: Quick AI Scan Quality */}
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#475569',
                    letterSpacing: '0.05em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Quick AI Scan & Grain Quality
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.6rem 0.8rem',
                    marginBottom: '0.85rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Crop Analyzed:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {result?.crop || report?.crop || 'Paddy'} ({Math.round((result?.crop_confidence || 0.94) * 100)}% Match)
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Condition Grade:</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        background:
                          (result?.condition || report?.condition) === 'Healthy'
                            ? '#dcfce7'
                            : (result?.condition || report?.condition) === 'Moderate'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          (result?.condition || report?.condition) === 'Healthy'
                            ? '#15803d'
                            : (result?.condition || report?.condition) === 'Moderate'
                            ? '#92400e'
                            : '#991b1b',
                      }}
                    >
                      {(result?.condition || report?.condition || 'Healthy').toUpperCase()} QUALITY
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Detected Defect:</span>
                    <strong style={{ color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>
                      {result?.disease_or_issue || report?.disease_or_issue || 'None Detected (Clean Sample)'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Quality Advisory:</span>
                    <strong style={{ color: '#0f172a', textAlign: 'right', maxWidth: '60%' }}>
                      {result?.quality_warning || report?.quality_warning || 'FAQ Compliant'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Intake Action:</span>
                    <strong style={{ color: '#15803d', textAlign: 'right', maxWidth: '60%' }}>
                      {result?.recommendation || report?.recommendation || 'Proceed with Mandi Intake'}
                    </strong>
                  </div>
                </div>

                {/* Section: Designated Centre Destination */}
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#475569',
                    letterSpacing: '0.05em',
                    marginBottom: '0.4rem',
                  }}
                >
                  Procurement Centre Destination
                </div>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '0.6rem 0.8rem',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Designated Centre:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {availableCenters.find((c) => c.id === selectedCenterId)?.name || 'Channagiri APMC Yard'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Center Address:</span>
                    <strong style={{ color: '#0f172a' }}>
                      {availableCenters.find((c) => c.id === selectedCenterId)?.address || 'APMC Yard, Channagiri'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Gate Timings:</span>
                    <strong style={{ color: '#0f172a' }}>08:30 AM – 05:30 PM</strong>
                  </div>
                </div>

                {/* Barcode & Seal */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px dashed #94a3b8',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'nowrap',
                  }}
                >
                  <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                    <svg
                      width="155"
                      height="26"
                      viewBox="0 0 155 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
                      aria-label="Barcode token"
                    >
                      <rect x="0" y="0" width="2.5" height="26" fill="#0f172a" />
                      <rect x="5" y="0" width="1.5" height="26" fill="#0f172a" />
                      <rect x="9" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="14" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="18" y="0" width="4" height="26" fill="#0f172a" />
                      <rect x="24" y="0" width="1.5" height="26" fill="#0f172a" />
                      <rect x="28" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="33" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="37" y="0" width="4" height="26" fill="#0f172a" />
                      <rect x="43" y="0" width="1.5" height="26" fill="#0f172a" />
                      <rect x="47" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="52" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="56" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="60" y="0" width="3.5" height="26" fill="#0f172a" />
                      <rect x="66" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="70" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="75" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="79" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="83" y="0" width="3.5" height="26" fill="#0f172a" />
                      <rect x="89" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="93" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="96" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="101" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="105" y="0" width="4" height="26" fill="#0f172a" />
                      <rect x="111" y="0" width="1.5" height="26" fill="#0f172a" />
                      <rect x="115" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="120" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="124" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="128" y="0" width="3.5" height="26" fill="#0f172a" />
                      <rect x="134" y="0" width="2" height="26" fill="#0f172a" />
                      <rect x="138" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="143" y="0" width="1" height="26" fill="#0f172a" />
                      <rect x="147" y="0" width="3" height="26" fill="#0f172a" />
                      <rect x="152" y="0" width="2" height="26" fill="#0f172a" />
                    </svg>
                    <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '4px', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      TOKEN: {receiptNumber}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#166534', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <span>✓</span>
                      <span>VERIFIED AI PRE-INSPECTION</span>
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px', whiteSpace: 'nowrap' }}>
                      Esy FARM Quality Engine v2.6
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '0.75rem',
                    fontSize: '0.65rem',
                    color: '#64748b',
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  Official preliminary receipt slip. Final weighment and MSP payment approval are conducted at designated APMC.
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div
              style={{
                padding: '0.85rem 1.25rem',
                background: '#ffffff',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={handleDownloadTextSlip}
                className="btn btn-outline"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Download size={16} />
                <span>Save Offline Copy (.txt)</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(false)}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handlePrintPdfReceipt}
                  className="btn btn-primary"
                  style={{
                    background: '#16a34a',
                    borderColor: '#15803d',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <Printer size={16} />
                  <span>Print / Save PDF Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for smooth spin */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
export default CropAssessmentPage;
