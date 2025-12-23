async function requestPermanentMediaAcces() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "monitor" },
      audio: false
    });

    // store global so agent page can reuse without new popup
    window.agentScreenStream = stream;

    // store deviceId so auto-reconnect works
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();
    localStorage.setItem("screenCaptureId", settings.deviceId);

    console.log("Permission granted and saved:", settings.deviceId);
    return true;
  } catch (err) {
    console.warn("Permission denied", err);
    return false;
  }
}
