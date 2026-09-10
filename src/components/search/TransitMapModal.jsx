import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Search,
  TrainFront,
  X,
} from "lucide-react";

import {
  BANGKOK_TRANSIT_LINES,
  getStationKey,
} from "../../data/bangkokTransit.js";

import ClickableTransitMap from "./ClickableTransitMap.jsx";

const TransitMapModal = ({
  isOpen,
  selectedStationKeys = [],
  onClose,
  onApply,
}) => {
  const [searchText, setSearchText] = useState("");
  const [activeLineId, setActiveLineId] = useState(null);
  const [draftStationKeys, setDraftStationKeys] =
    useState([]);

  useEffect(() => {
    if (!isOpen) return;

    setDraftStationKeys(selectedStationKeys);
    setSearchText("");

    if (BANGKOK_TRANSIT_LINES.length > 0) {
      setActiveLineId(
        BANGKOK_TRANSIT_LINES[0].id
      );
    }
  }, [isOpen, selectedStationKeys]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const filteredLines = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) {
      return BANGKOK_TRANSIT_LINES;
    }

    return BANGKOK_TRANSIT_LINES.map((line) => {
      const lineMatches = line.name
        .toLowerCase()
        .includes(keyword);

      const stations = line.stations.filter(
        (station) =>
          station.name.toLowerCase().includes(keyword) ||
          station.code.toLowerCase().includes(keyword)
      );

      if (lineMatches) {
        return line;
      }

      return {
        ...line,
        stations,
      };
    }).filter((line) => line.stations.length > 0);
  }, [searchText]);

  const selectedStations = useMemo(() => {
    const results = [];

    BANGKOK_TRANSIT_LINES.forEach((line) => {
      line.stations.forEach((station) => {
        const key = getStationKey(
          line.id,
          station.code
        );

        if (draftStationKeys.includes(key)) {
          results.push({
            ...station,
            key,
            lineId: line.id,
            lineName: line.name,
            lineColor: line.color,
          });
        }
      });
    });

    return results;
  }, [draftStationKeys]);

  if (!isOpen) return null;

  const toggleLine = (lineId) => {
    setActiveLineId((currentLineId) =>
      currentLineId === lineId ? null : lineId
    );
  };

  const toggleStation = (lineId, stationCode) => {
    const stationKey = getStationKey(
      lineId,
      stationCode
    );

    setDraftStationKeys((currentKeys) =>
      currentKeys.includes(stationKey)
        ? currentKeys.filter(
          (key) => key !== stationKey
        )
        : [...currentKeys, stationKey]
    );
  };

  const clearStations = () => {
    setDraftStationKeys([]);
  };

  return (
    <div
      className="transit-modal-backdrop"
      onMouseDown={onClose}
    >
      <section
        className="transit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transit-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="transit-modal-header">
          <div>
            <h2 id="transit-modal-title">
              Search by BTS/MRT
            </h2>

            <p>
              Select one or more train stations
              near your next home.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close station selector"
          >
            <X size={25} />
          </button>
        </header>

        <div className="transit-modal-search">
          <Search size={20} />

          <input
            type="search"
            placeholder="Search station name or station code"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />
        </div>

        <div className="transit-modal-body">
          <aside className="transit-line-panel">
            <h3>Select line or station</h3>

            <div className="transit-lines">
              {filteredLines.map((line) => {
                const isExpanded =
                  activeLineId === line.id;

                return (
                  <div
                    className="transit-line"
                    key={line.id}
                  >
                    <button
                      type="button"
                      className="transit-line-button"
                      onClick={() =>
                        toggleLine(line.id)
                      }
                    >
                      <span
                        className="transit-line-code"
                        style={{
                          backgroundColor: line.color,
                        }}
                      >
                        {line.shortName ||
                          line.code ||
                          line.id}
                      </span>

                      <span className="transit-line-name">
                        {line.name}
                      </span>

                      {isExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>

                    {(isExpanded || searchText) && (
                      <div className="transit-station-list">
                        {line.stations.map(
                          (station) => {
                            const stationKey =
                              getStationKey(
                                line.id,
                                station.code
                              );

                            const isSelected =
                              draftStationKeys.includes(
                                stationKey
                              );

                            return (
                              <button
                                type="button"
                                className={`transit-station-button ${isSelected
                                  ? "selected"
                                  : ""
                                  }`}
                                key={stationKey}
                                onClick={() =>
                                  toggleStation(
                                    line.id,
                                    station.code
                                  )
                                }
                              >
                                <span
                                  className="transit-station-dot"
                                  style={{
                                    borderColor:
                                      line.color,
                                  }}
                                >
                                  {isSelected && (
                                    <Check size={12} />
                                  )}
                                </span>

                                <span>
                                  <strong>
                                    {station.code}
                                  </strong>

                                  {station.name}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="transit-map-panel">
            <div className="transit-map-heading">
              <div>
                <TrainFront size={22} />

                <div>
                  <h3>Bangkok rail network</h3>
                  <p>
                    Click a station to select it
                  </p>
                </div>
              </div>

              <span>
                {draftStationKeys.length} selected
              </span>
            </div>

            <ClickableTransitMap
              selectedStationKeys={draftStationKeys}
              onToggleStation={toggleStation}
            />

            {selectedStations.length > 0 && (
              <div className="selected-station-section">
                <h3>Selected stations</h3>

                <div className="selected-station-chips">
                  {selectedStations.map(
                    (station) => (
                      <button
                        type="button"
                        key={station.key}
                        onClick={() =>
                          toggleStation(
                            station.lineId,
                            station.code
                          )
                        }
                      >
                        <span
                          style={{
                            backgroundColor:
                              station.lineColor,
                          }}
                        />

                        {station.code} {station.name}

                        <X size={14} />
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="transit-modal-footer">
          <button
            type="button"
            onClick={clearStations}
            disabled={
              draftStationKeys.length === 0
            }
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() =>
              onApply(draftStationKeys)
            }
          >
            Apply
            {draftStationKeys.length > 0
              ? ` (${draftStationKeys.length})`
              : ""}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default TransitMapModal;