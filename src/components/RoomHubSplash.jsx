import logoLeft from "../assets/animeted/roomhub-mark-left.svg";
import logoRight from "../assets/animeted/roomhub-mark-right.svg";

import "../styles/components/roomhub-splash.css";

const RoomHubSplash = ({ isLeaving }) => {
  return (
    <div
      className={`roomhub-splash ${
        isLeaving ? "roomhub-splash--leaving" : ""
      }`}
    >
      <div className="roomhub-splash__logo">
        <img
          src={logoLeft}
          alt=""
          className="roomhub-splash__left"
        />

        <img
          src={logoRight}
          alt=""
          className="roomhub-splash__right"
        />
      </div>
    </div>
  );
};

export default RoomHubSplash;