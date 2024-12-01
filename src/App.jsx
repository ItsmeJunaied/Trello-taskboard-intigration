import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./App.css";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState("00:00:00");
  const [projectId] = useState(25);
  const [intervalId, setIntervalId] = useState(null);
  const [trackingStarted, setTrackingStarted] = useState(false);

  // Utility to convert HH:MM:SS string to seconds
  const parseDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Utility to format time in HH:MM:SS format
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get the token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Start the tracking and duration increment
  const handleStart = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/track/start`,
        { project_id: projectId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(
        "Started tracking:",
        response.data,
        response.data.data.duration
      );

      // Set initial duration from response
      const initialDuration = response.data.data.duration || "00:00:00";
      setDuration(initialDuration);

      setIsRunning(true);
      setTrackingStarted(true);
      // Convert initial duration to seconds
      let seconds = parseDurationToSeconds(initialDuration);

      // Start incrementing the duration every second
      const id = setInterval(() => {
        seconds += 1;
        setDuration(formatDuration(seconds));
      }, 1000);
      setIntervalId(id);
    } catch (error) {
      console.error("Error starting tracking:", error);
    }
  };

  // Pause the tracking and stop the duration increment
  const handlePause = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/track/pause`,
        { project_id: projectId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Paused tracking:", response.data);
      setIsRunning(false);

      // Clear the interval to stop the duration increment
      if (intervalId) {
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error("Error pausing tracking:", error);
    }
  };

  // End the tracking and reset everything
  const handleEnd = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/track/end`,
        { project_id: projectId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log("Ended tracking:", response.data);
      setIsRunning(false);

      // Clear the interval and reset duration
      if (intervalId) {
        clearInterval(intervalId);
      }
      setDuration("00:00:00");
    } catch (error) {
      console.error("Error ending tracking:", error);
    }
  };

  useEffect(() => {
    // Clean up interval on component unmount or when tracking is paused or ended
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    console.log(trackingStarted);
    if (trackingStarted) {
      console.log("hello");
      TrelloPowerUp.initialize({
        "card-back-section": (t, options) => {
          return t.card("all").then((all) => {
            console.log("Card ID:", all.id);

            const popupUrl = `${t.signUrl("../popup.html")}?cardId=${
              all.id
            }&taskName=${encodeURIComponent(all.name)}`;

            return {
              title: "Staff Tracker Section",
              icon: "https://time.flytesolutions.com/favicon.ico",
              content: {
                type: "iframe",
                url: popupUrl,
                height: 150,
              },
            };
          });
        },
      });
    }
  }, [trackingStarted]);

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-3">
      <h1 className="text-3xl font-semibold text-blue-500">
        Welcome To Dashboard
      </h1>
      <p>Start Track Time: {duration}</p>

      {/* Start/Pause Button */}
      <button
        type="button"
        onClick={isRunning ? handlePause : handleStart} // Toggle between start and pause
        className="rounded-full bg-blue-500 text-white text-lg w-8 h-8"
      >
        <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
      </button>

      {/* End Button */}
      <button
        onClick={handleEnd}
        className="mt-3 rounded-full bg-red-500 text-white text-lg px-4 py-2"
      >
        End
      </button>
    </div>
  );
}

export default App;
