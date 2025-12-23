import { useRef, useState, useCallback } from "react";

export const useVideoRecording = () => {
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const startRecording = useCallback(async (stream) => {
    try {
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType: "video/webm;codecs=vp9,opus",
      };

      // Fallback for browsers that don't support vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "video/webm;codecs=vp8,opus";
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      return mediaRecorder;
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error("No recording in progress"));
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }

        setIsRecording(false);

        resolve({
          blob,
          duration: recordingTime,
          mimeType: blob.type,
        });
      };

      mediaRecorder.stop();
    });
  }, [recordingTime]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  }, []);

  const downloadRecording = useCallback(async (blob, fileName = "conference-recording.webm") => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  const uploadRecording = useCallback(
    async (blob, conferenceId, token) => {
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("conferenceId", conferenceId);
      formData.append("duration", recordingTime);
      formData.append("fileSize", blob.size);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/video-conference/upload-recording`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        return await response.json();
      } catch (error) {
        console.error("Error uploading recording:", error);
        throw error;
      }
    },
    [recordingTime]
  );

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    downloadRecording,
    uploadRecording,
  };
};
