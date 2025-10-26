// src/services/EkycSimulatorService.js
class EkycSimulatorService {
    constructor() {
        this.ekycSessions = new Map();
        this.verificationSteps = [
            'document_upload',
            'face_detection',
            'liveness_check',
            'document_verification',
            'face_matching'
        ];
    }

    async createEkycSession(sessionId, userProfile) {
        const session = {
            id: sessionId,
            user: userProfile,
            steps: {},
            status: 'initiated',
            startTime: Date.now(),
            logs: []
        };

        this.ekycSessions.set(sessionId, session);
        return session;
    }

    async simulateDocumentUpload(sessionId, documentType, imageData) {
        const session = this.ekycSessions.get(sessionId);

        // 模擬文件 OCR 處理
        const ocrResult = {
            success: true,
            extractedData: {
                name: '王大明',
                idNumber: 'A123456789',
                birthDate: '1990-01-01',
                address: '台中市北區三民路三段129號'
            },
            confidence: 0.95,
            processingTime: Math.random() * 500 + 200
        };

        session.steps.document_upload = {
            status: 'completed',
            result: ocrResult,
            timestamp: Date.now()
        };

        session.logs.push({
            step: 'document_upload',
            message: `文件上傳成功 - ${documentType}`,
            timestamp: new Date().toISOString()
        });

        return ocrResult;
    }

    async simulateFaceDetection(sessionId, faceImage) {
        const session = this.ekycSessions.get(sessionId);

        // 模擬人臉偵測
        const faceDetectionResult = {
            success: true,
            faces: [{
                bbox: { x: 120, y: 150, width: 200, height: 250 },
                confidence: 0.98,
                landmarks: {
                    leftEye: { x: 160, y: 200 },
                    rightEye: { x: 240, y: 200 },
                    nose: { x: 200, y: 250 },
                    mouth: { x: 200, y: 300 }
                },
                quality: {
                    sharpness: 0.92,
                    brightness: 0.88,
                    faceSize: 'optimal'
                }
            }],
            processingTime: Math.random() * 300 + 150
        };

        session.steps.face_detection = {
            status: 'completed',
            result: faceDetectionResult,
            timestamp: Date.now()
        };

        return faceDetectionResult;
    }

    async simulateLivenessCheck(sessionId, videoFrames) {
        const session = this.ekycSessions.get(sessionId);

        // 模擬活體檢測
        const livenessResult = {
            success: true,
            isLive: true,
            confidence: 0.94,
            checks: {
                blinkDetection: { passed: true, confidence: 0.96 },
                headMovement: { passed: true, confidence: 0.92 },
                textureAnalysis: { passed: true, confidence: 0.95 },
                depthEstimation: { passed: true, confidence: 0.89 }
            },
            processingTime: Math.random() * 800 + 400
        };

        session.steps.liveness_check = {
            status: 'completed',
            result: livenessResult,
            timestamp: Date.now()
        };

        return livenessResult;
    }

    async simulateFaceMatching(sessionId) {
        const session = this.ekycSessions.get(sessionId);

        // 模擬人臉比對
        const matchResult = {
            success: true,
            similarity: 0.92,
            threshold: 0.85,
            matched: true,
            confidence: 0.93,
            processingTime: Math.random() * 400 + 200
        };

        session.steps.face_matching = {
            status: 'completed',
            result: matchResult,
            timestamp: Date.now()
        };

        // 更新整體狀態
        session.status = 'completed';
        session.verificationResult = {
            passed: true,
            overall_confidence: 0.93,
            completedTime: Date.now(),
            duration: Date.now() - session.startTime
        };

        return matchResult;
    }

    getSession(sessionId) {
        return this.ekycSessions.get(sessionId);
    }
}

module.exports = EkycSimulatorService;
