import { useState } from "react";
import api, { getApiErrorMessage } from "../services/api.js";

export default function useZodiacMatches(setJoinFeedback) {
  const [zodiacMode, setZodiacMode] = useState(false);
  const [zodiacMatches, setZodiacMatches] = useState([]);
  const [userZodiac, setUserZodiac] = useState(null);
  const [zodiacLoading, setZodiacLoading] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [birthdateRequired, setBirthdateRequired] = useState(false);

  const handleFindByZodiac = async () => {
    setZodiacLoading(true);
    setJoinFeedback(null);
    setBirthdateRequired(false);

    try {
      const response = await api.get("/community-posts/zodiac-matches");

      setZodiacMatches(
        Array.isArray(response.data?.matches) ? response.data.matches : [],
      );

      setUserZodiac(response.data?.userZodiac || null);
      setExpandedMatchId(null);
      setZodiacMode(true);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to find zodiac matches",
      );

      if (
        error.response?.status === 400 &&
        message === "Birthdate is required for zodiac matching"
      ) {
        setBirthdateRequired(true);
        return;
      }

      setJoinFeedback({
        message,
        isError: true,
      });
    } finally {
      setZodiacLoading(false);
    }
  };

  return {
    zodiacMode,
    setZodiacMode,
    zodiacMatches,
    userZodiac,
    zodiacLoading,
    birthdateRequired,
    setBirthdateRequired,
    expandedMatchId,
    setExpandedMatchId,
    handleFindByZodiac,
  };
}
