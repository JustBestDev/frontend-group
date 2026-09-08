import { useEffect, useState } from "react";

import RoomHubSplash from "./components/RoomHubSplash.jsx";
import AppRouter from "./routers/AppRouter.jsx";

function App() {
  const [minimumTimeDone, setMinimumTimeDone] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimeDone(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // ตรงนี้ภายหลังเอา initial fetch จริงมาใส่
      } finally {
        setAppReady(true);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!minimumTimeDone || !appReady) return;

    setIsLeaving(true);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [minimumTimeDone, appReady]);

  return (
    <>
      <AppRouter />

      {showSplash && (
        <RoomHubSplash isLeaving={isLeaving} />
      )}
    </>
  );
}

export default App;