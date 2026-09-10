import {
    useMemo,
    useRef,
    useState,
} from "react";

import {
    LocateFixed,
    Minus,
    Plus,
} from "lucide-react";

import {
    BANGKOK_TRANSIT_LINES,
    getStationKey,
} from "../../data/bangkokTransit.js";

/*
  x = ตำแหน่งซ้ายไปขวาเป็นเปอร์เซ็นต์
  y = ตำแหน่งบนลงล่างเป็นเปอร์เซ็นต์

  ตัวเลขชุดนี้เป็นค่าเริ่มต้น
  สามารถปรับให้ตรงกับรูปภายหลังได้
*/

const TRANSIT_MAP_HOTSPOTS = [
    {
        lineSearch: "Sukhumvit",
        code: "N24",
        name: "Khu Khot",
        x: 65.53,
        y: 4.97,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N23",
        name: "Yeak Kor Por Aor",
        x: 61.87,
        y: 5.04,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N22",
        name: "Royal Thai Air Force Museum",
        x: 57.97,
        y: 6.94,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N21",
        name: "Bhumibol Adulyadej Hospital",
        x: 56.36,
        y: 8.55,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N20",
        name: "Saphan Mai",
        x: 54.76,
        y: 10.13,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N19",
        name: "Sai Yud",
        x: 53.15,
        y: 11.75,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N18",
        name: "Phahon Yothin 59",
        x: 49.71,
        y: 18.62,
    },
    {
          lineSearch: "Sukhumvit",
        code: "N17",
        name: "Wat Phra Sri Mahathat",
        x: 49.69,
        y: 16.02,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N16",
        name: "11th Infantry Regiment",
        x: 49.71,
        y: 18.62,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N15",
        name: "Bang Bua",
        x: 49.71,
        y: 21.05,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N14",
        name: "Royal Forest Department",
        x: 49.71,
        y: 23.46,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N13",
        name: "Kasetsart University",
        x: 49.71,
        y: 25.65,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N12",
        name: "Sena Nikhom",
        x: 49.71,
        y: 28.29,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N11",
        name: "Ratchayothin",
        x: 49.71,
        y: 30.72,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N10",
        name: "Phahon Yothin 24",
        x: 49.71,
        y: 33.19,
    },
     {
        lineSearch: "Sukhumvit",
        code: "N9",
        name: "Ha Yaek Lat Phrao",
        x: 49.71,
        y: 36.10,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N8",
        name: "Mo Chit",
        x: 49.71,
        y: 38.94,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N7",
        name: "Saphan Khwai",
        x: 49.71,
        y: 40.86,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N6",
        name: "Sena Ruam",
        x: 49.71,
        y: 45.86,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N5",
        name: "Ari",
        x: 49.71,
        y: 44.63,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N6",
        name: "Sanam Pao",
        x: 49.71,
        y: 44.63,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N3",
        name: "Victory Monument",
        x: 49.72,
        y: 48.38,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N2",
        name: "Phaya Thai",
        x: 49.70,
        y: 50.47,
    },
    {
        lineSearch: "Sukhumvit",
        code: "N1",
        name: "Ratchathewi",
        x: 49.70,
        y: 54.33,
    },
    {
        lineSearch: "Sukhumvit",
        code: "CEN",
        name: "Siam",
        x: 50.60,
        y: 57.92,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E1",
        name: "Chit Lom",
        x: 53.40,
        y: 57.80,
    },

    {
        lineSearch: "Sukhumvit",
        code: "E2",
        name: "Phloen Chit",
        x: 56.21,
        y: 57.80,
    },

    {
        lineSearch: "Sukhumvit",
        code: "E3",
        name: "Nana",
        x: 59.02,
        y: 57.80,
    },

    {
        lineSearch: "Sukhumvit",
        code: "E4",
        name: "Asok",
        x: 61.84,
        y: 57.80,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E5",
        name: "Phrom Phong",
        x: 64.45,
        y: 57.80,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E6",
        name: "Thong lo",
        x: 66.72,
        y: 59.14,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E7",
        name: "Ekkamai",
        x: 68.35,
        y: 60.81,
    },

    {
        lineSearch: "Sukhumvit",
        code: "E8",
        name: "Phra Khanong",
        x: 69.99,
        y: 62.45,
    },

    {
        lineSearch: "Sukhumvit",
        code: "E9",
        name: "On nut",
        x: 71.63,
        y: 64.07,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E10",
        name: "Bang Chak",
        x: 73.27,
        y: 65.72,
    },
     {
        lineSearch: "Sukhumvit",
        code: "E11",
        name: "Punnawithi",
        x: 74.13,
        y: 67.75,
    },
     {
        lineSearch: "Sukhumvit",
        code: "E12",
        name: "Udomsuk",
        x: 74.13,
        y: 70.22,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E13",
        name: "Bang Na",
        x: 74.13,
        y: 72.68,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E14",
        name: "Baering",
        x: 74.13,
        y: 75.15,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E15",
        name: "Samrong",
        x: 74.09,
        y: 77.60,
    },
      {
        lineSearch: "Sukhumvit",
        code: "E16",
        name: "Pu Chao",
        x: 74.13,
        y: 79.96,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E17",
        name: "Chang Erawan",
        x: 74.13,
        y: 82.25,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E18",
        name: "Royal Thai Naval Academy",
        x: 74.13,
        y: 84.58,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E19",
        name: "Pak Nam",
        x: 74.13,
        y: 86.90,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E20",
        name: "Srinagarindra",
        x: 74.13,
        y: 89.22,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E21",
        name: "Phraek Sa",
        x: 74.13,
        y: 91.53,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E22",
        name: "Sai Luat",
        x: 74.13,
        y: 93.86,
    },
    {
        lineSearch: "Sukhumvit",
        code: "E23",
        name: "Kheha",
        x: 76.43,
        y: 96.17,
    },
     {
        lineSearch: "Silom",
        code: "S1",
        name: "Ratchadamri",
        x: 51.34,
        y: 60.58,
    },
    {
        lineSearch: "Silom",
        code: "S2",
        name: "Sala Daeng",
        x: 51.34,
        y: 62.99,
    },
    {
        lineSearch: "Silom",
        code: "S2",
        name: "Sala Daeng",
        x: 51.34,
        y: 62.99,
    },
    {
        lineSearch: "Silom",
        code: "S3",
        name: "Chong Nonsi",
        x: 51.34,
        y: 66.44,
    },
    {
        lineSearch: "Silom",
        code: "S4",
        name: "Saint Louis",
        x: 50.82,
        y: 69.42,
    },
    {
        lineSearch: "Silom",
        code: "S5",
        name: "Surasak",
        x: 49.46,
        y: 70.79,
    },
    {
        lineSearch: "Silom",
        code: "S6",
        name: "Saphan Taksin",
        x: 48.10,
        y: 72.15,
    },
    {
        lineSearch: "Silom",
        code: "S7",
        name: "Krung Thon Buri",
        x: 44.13,
        y: 73.51,
    },
     {
        lineSearch: "Silom",
        code: "S8",
        name: "Wongwian Yai",
        x: 39.67,
        y: 73.50,
    },
     {
        lineSearch: "Silom",
        code: "S9",
        name: "Pho Nimit",
        x: 35.15,
        y: 73.48,
    },
     {
        lineSearch: "Silom",
        code: "S10",
        name: "Talat Phlu",
        x: 30.64,
        y: 73.50,
    },
     {
        lineSearch: "Silom",
        code: "S11",
        name: "Wutthakat",
        x: 25.82,
        y: 71.29,
    },
    {
        lineSearch: "Silom",
        code: "S12",
        name: "Bang Wa",
        x: 22.25,
        y: 67.64,
    },
    {
        lineSearch: "Blue",
        code: "BL38",
        name: "Lak Song",
        x: 11.74,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL37",
        name: "Lak Song",
        x: 14.16,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL36",
        name: "Phasi Charoen",
        x: 16.47,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL35",
        name: "Phetkasem 48",
        x: 18.74,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL34",
        name: "Bang Wa",
        x: 21.18,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL33",
        name: "Bang Phai",
        x: 24.74,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL32",
        name: "Itsaraphap",
        x: 30.03,
        y: 66.54,
    },
    {
        lineSearch: "Blue",
        code: "BL31",
        name: "Sanam Chai",
        x: 32.94,
        y: 65.07,
    },
    {
        lineSearch: "Blue",
        code: "BL30",
        name: "Sam Yot",
        x: 35.74,
        y: 62.98,
    },
    {
        lineSearch: "Blue",
        code: "BL29",
        name: "Wat Mangkon",
        x: 39.45,
        y: 62.94,
    },
    {
        lineSearch: "Blue",
        code: "BL28",
        name: "Hua Lamphong",
        x: 43.23,
        y: 62.94,
    },
    {
        lineSearch: "Blue",
        code: "BL27",
        name: "Sam Yan",
        x: 46.99,
        y: 62.94,
    },
    {
        lineSearch: "Blue",
        code: "BL26",
        name: "Si Lom",
        x: 52.73,
        y: 62.99,
    },
    {
        lineSearch: "Blue",
        code: "BL25",
        name: "Lumphini",
        x: 55.86,
        y: 62.94,
    },
    {
        lineSearch: "Blue",
        code: "BL24",
        name: "Klong Toei",
        x: 59.75,
        y: 62.94,
    },
    {
        lineSearch: "Blue",
        code: "BL23",
        name: "Queen Sirikit National Convention Centre",
        x: 61.79,
        y: 60.48,
    },
    {
        lineSearch: "Blue",
        code: "BL22",
        name: "Sukhumvit",
        x: 61.83,
        y: 56.45,
    },
    {
        lineSearch: "Blue",
        code: "BL21",
        name: "Phetchaburi",
        x: 61.83,
        y: 50.48,
    },
    {
        lineSearch: "Blue",
        code: "BL20",
        name: "Phra Ram 9",
        x: 61.83,
        y: 47.17,
    },
    {
        lineSearch: "Blue",
        code: "BL19",
        name: "Thailand Cultural Centre",
        x: 61.83,
        y: 44.51,
    },
    {
        lineSearch: "Blue",
        code: "BL18",
        name: "Huai Kwang",
        x: 60.46,
        y: 41.07,
    },
    {
        lineSearch: "Blue",
        code: "BL17",
        name: "Sutthisan",
        x: 58.57,
        y: 39.18,
    },
     {
        lineSearch: "Blue",
        code: "BL16",
        name: "Ratchdaphisek",
        x: 56.72,
        y: 37.32,
    },
     {
        lineSearch: "Blue",
        code: "BL15",
        name: "Lat Phrao",
        x: 53.40,
        y: 36.09,
    },
     {
        lineSearch: "Blue",
        code: "BL14",
        name: "Phahon Yothin",
        x: 51.07,
        y: 36.09,
    },
     {
        lineSearch: "Blue",
        code: "BL13",
        name: "Chatuchak Park",
        x: 48.4,
        y: 38.91,
    },
     {
        lineSearch: "Blue",
        code: "BL12",
        name: "Kamphaeng Phet",
        x: 46.58,
        y: 41.31,
    },
     {
        lineSearch: "Blue",
        code: "BL11",
        name: "Bang Sue",
        x: 41.16,
        y: 41.38,
    },
    {
        lineSearch: "Blue",
        code: "BL10",
        name: "Tao poon",
        x: 35.73,
        y: 41.38,
    },
    {
        lineSearch: "Blue",
        code: "BL09",
        name: "Bang Pho",
        x: 32.16,
        y: 42.84,
    },
    {
        lineSearch: "Blue",
        code: "BL08",
        name: "Bang O",
        x: 30.16,
        y: 44.79,
    },
    {
        lineSearch: "Blue",
        code: "BL07",
        name: "Bang Phlat",
        x: 28.2,
        y: 46.79,
    },
    {
        lineSearch: "Blue",
        code: "BL06",
        name: "Sirindhorn",
        x: 26.85,
        y: 49.62,
    },
    {
        lineSearch: "Blue",
        code: "BL05",
        name: "Bang Yi Khan",
        x: 26.85,
        y: 53.36,
    },
    {
        lineSearch: "Blue",
        code: "BL04",
        name: "Bang Khun Non",
        x: 26.85,
        y: 57.25,
    },
    {
        lineSearch: "Blue",
        code: "BL03",
        name: "Fai Chai",
        x: 26.85,
        y: 60.63,
    },
    {
        lineSearch: "Blue",
        code: "BL02",
        name: "Charan 13",
        x: 26.85,
        y: 63.75,
    },
    {
        lineSearch: "Blue",
        code: "BL01",
        name: "Tha Pha",
        x: 26.95,
        y: 66.54,
    },
     {
        lineSearch: "Yellow",
        code: "YL23",
        name: "Samrong",
        x: 75.46,
        y: 77.60,
    },
     {
        lineSearch: "Yellow",
        code: "YL22",
        name: "Thipphawan",
        x: 77.90,
        y: 77.60,
    },
    {
        lineSearch: "Yellow",
        code: "YL21",
        name: "Si Thepha",
        x: 80.32,
        y: 77.60,
    },
    {
        lineSearch: "Yellow",
        code: "YL20",
        name: "Si Dan",
        x: 82.78,
        y: 75.77,
    },
    {
        lineSearch: "Yellow",
        code: "YL19",
        name: "Si Bearing",
        x: 82.7,
        y: 73.1,
    },
    {
        lineSearch: "Yellow",
        code: "YL18",
        name: "Si La Salle",
        x: 82.78,
        y: 70.48,
    },
    {
        lineSearch: "Yellow",
        code: "YL17",
        name: "Si Iam",
        x: 82.78,
        y: 67.74,
    },

     {
        lineSearch: "Yellow",
        code: "YL16",
        name: "Si Udom",
        x: 82.78,
        y: 65.06,
    },
    {
        lineSearch: "Yellow",
        code: "YL15",
        name: "Suan Luang Rama IX",
        x: 82.78,
        y: 62.37,
    },
    {
        lineSearch: "Yellow",
        code: "YL14",
        name: "Srinagarindra 38",
        x: 82.78,
        y: 59.66,
    },
     {
        lineSearch: "Yellow",
        code: "YL13",
        name: "Si Nut",
        x: 82.78,
        y: 56.99,
    },
    {
        lineSearch: "Yellow",
        code: "YL12",
        name: "Kalantan",
        x: 82.78,
        y: 54.31,
    },
    {
        lineSearch: "Yellow",
        code: "YL11",
        name: "Hua Mak",
        x: 82.78,
        y: 51.52,
    },
    {
        lineSearch: "Yellow",
        code: "YL10",
        name: "Si Kritha",
        x: 82.78,
        y: 46.28,
    },
     {
        lineSearch: "Yellow",
        code: "YL09",
        name: "Yaek Lam Sali",
        x: 80.49,
        y: 42.99,
    },
    {
        lineSearch: "Yellow",
        code: "YL08",
        name: "Bang Kapi",
        x: 78.19,
        y: 40.70,
    },
    {
        lineSearch: "Yellow",
        code: "YL07",
        name: "Lat Phrao 101",
        x: 75.79,
        y: 38.34,
    },
    {
        lineSearch: "Yellow",
        code: "YL06",
        name: "Mahat Thai",
        x: 73.46,
        y: 35.89,
    },
    {
        lineSearch: "Yellow",
        code: "YL05",
        name: "Lat Phrao 83",
        x: 70.19,
        y: 35.16,
    },
    {
        lineSearch: "Yellow",
        code: "YL04",
        name: "Lat Phrao 71",
        x: 66.15,
        y: 35.16,
    },
    {
        lineSearch: "Yellow",
        code: "YL03",
        name: "Chok Chai 4",
        x: 62.07,
        y: 35.16,
    },
    {
        lineSearch: "Yellow",
        code: "YL02",
        name: "Phawana",
        x: 57.98,
        y: 35.16,
    },
    {
        lineSearch: "Yellow",
        code: "YL01",
        name: "Lat Phrao",
        x: 54.31,
        y: 35.16,
    },

    



];

const ClickableTransitMap = ({
    selectedStationKeys = [],
    onToggleStation,
}) => {
    const [zoom, setZoom] = useState(1);

    const [lastCoordinate, setLastCoordinate] =
        useState(null);

    const [isDragging, setIsDragging] =
        useState(false);

    const scrollAreaRef = useRef(null);

    const dragPositionRef = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0,
    });

    const baseMapSize = 1100;
    const currentMapSize = baseMapSize * zoom;

    const mapStations = useMemo(() => {
        return TRANSIT_MAP_HOTSPOTS.map(
            (hotspot) => {
                const line =
                    BANGKOK_TRANSIT_LINES.find(
                        (currentLine) =>
                            currentLine.name
                                .toLowerCase()
                                .includes(
                                    hotspot.lineSearch.toLowerCase()
                                )
                    );

                if (!line) return null;

                const station = line.stations.find(
                    (currentStation) =>
                        currentStation.code ===
                        hotspot.code
                );

                if (!station) return null;

                return {
                    ...hotspot,
                    lineId: line.id,
                    lineName: line.name,
                    color: line.color,
                    stationKey: getStationKey(
                        line.id,
                        station.code
                    ),
                };
            }
        ).filter(Boolean);
    }, []);

    const zoomIn = () => {
        setZoom((currentZoom) =>
            Math.min(currentZoom + 0.25, 2.5)
        );
    };

    const zoomOut = () => {
        setZoom((currentZoom) =>
            Math.max(currentZoom - 0.25, 0.75)
        );
    };

    const resetZoom = () => {
        setZoom(1);
    };

    const handleMapCoordinateClick = async (
        event
    ) => {
        if (event.target.closest("button")) {
            return;
        }

        const canvas = event.currentTarget;

        const rectangle =
            canvas.getBoundingClientRect();

        const x =
            ((event.clientX - rectangle.left) /
                rectangle.width) *
            100;

        const y =
            ((event.clientY - rectangle.top) /
                rectangle.height) *
            100;

        const coordinate = {
            x: Number(x.toFixed(2)),
            y: Number(y.toFixed(2)),
        };

        setLastCoordinate(coordinate);

        const coordinateText =
            `x: ${coordinate.x}, y: ${coordinate.y}`;

        console.log(
            "Station coordinate:",
            coordinateText
        );

        try {
            await navigator.clipboard.writeText(
                coordinateText
            );
        } catch {
            console.log(coordinateText);
        }
    };

    const handlePointerDown = (event) => {
        if (event.target.closest("button")) {
            return;
        }

        const scrollArea = scrollAreaRef.current;

        if (!scrollArea) return;

        dragPositionRef.current = {
            startX: event.clientX,
            startY: event.clientY,
            scrollLeft: scrollArea.scrollLeft,
            scrollTop: scrollArea.scrollTop,
        };

        setIsDragging(true);

        scrollArea.setPointerCapture(
            event.pointerId
        );
    };

    const handlePointerMove = (event) => {
        if (!isDragging) return;

        const scrollArea = scrollAreaRef.current;

        if (!scrollArea) return;

        const distanceX =
            event.clientX -
            dragPositionRef.current.startX;

        const distanceY =
            event.clientY -
            dragPositionRef.current.startY;

        scrollArea.scrollLeft =
            dragPositionRef.current.scrollLeft -
            distanceX;

        scrollArea.scrollTop =
            dragPositionRef.current.scrollTop -
            distanceY;
    };

    const stopDragging = (event) => {
        const scrollArea = scrollAreaRef.current;

        if (
            scrollArea?.hasPointerCapture(
                event.pointerId
            )
        ) {
            scrollArea.releasePointerCapture(
                event.pointerId
            );
        }

        setIsDragging(false);
    };

    return (
        <div className="clickable-transit-map">
            <div className="transit-zoom-controls">
                <button
                    type="button"
                    onClick={zoomIn}
                    aria-label="Zoom in"
                    title="Zoom in"
                >
                    <Plus size={20} />
                </button>

                <button
                    type="button"
                    onClick={zoomOut}
                    aria-label="Zoom out"
                    title="Zoom out"
                >
                    <Minus size={20} />
                </button>

                <button
                    type="button"
                    onClick={resetZoom}
                    aria-label="Reset zoom"
                    title="Reset zoom"
                >
                    <LocateFixed size={19} />
                </button>
            </div>

            <div
                ref={scrollAreaRef}
                className={`transit-map-scroll-area ${isDragging ? "dragging" : ""
                    }`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                onPointerLeave={(event) => {
                    if (isDragging) {
                        stopDragging(event);
                    }
                }}
            >
                <div
                    className="transit-interactive-canvas"
                    style={{
                        width: `${currentMapSize}px`,
                        height: `${currentMapSize}px`,
                    }}
                    onClick={handleMapCoordinateClick}
                >
                    <img
                        src="/images/bangkok-transit-map.jpg"
                        alt="Bangkok BTS MRT transit map"
                        className="transit-interactive-image"
                        draggable="false"
                    />

                    {lastCoordinate && (
                        <div
                            className="transit-coordinate-marker"
                            style={{
                                left: `${lastCoordinate.x}%`,
                                top: `${lastCoordinate.y}%`,
                            }}
                        >
                            <span />

                            <strong>
                                x: {lastCoordinate.x},
                                y: {lastCoordinate.y}
                            </strong>
                        </div>
                    )}

                    {mapStations.map((station) => {
                        const isSelected =
                            selectedStationKeys.includes(
                                station.stationKey
                            );

                        return (
                            <button
                                type="button"
                                key={station.stationKey}
                                className={`transit-map-hotspot ${isSelected
                                    ? "selected"
                                    : ""
                                    }`}
                                style={{
                                    left: `${station.x}%`,
                                    top: `${station.y}%`,
                                    "--station-color":
                                        station.color,
                                }}
                                title={`${station.code} ${station.name}`}
                                aria-label={`Select ${station.code} ${station.name}`}
                                onClick={() =>
                                    onToggleStation(
                                        station.lineId,
                                        station.code
                                    )
                                }
                            >
                                <span className="transit-hotspot-dot" />

                                <span className="transit-hotspot-label">
                                    {station.code}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="transit-map-zoom-label">
                Zoom {Math.round(zoom * 100)}%
            </div>
        </div>
    );
};

export default ClickableTransitMap;
