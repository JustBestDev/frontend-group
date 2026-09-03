import "../../styles/pages/room-detail.css";
import SubRoomCard from "../../components/roomDetail/SubRoomCard";
import {
  BadgeDollarSign,
  Info,
  SquareCheck,
  SquareX,
  UserRound,
} from "lucide-react";

export default function RoomDetail() {
  return (
    <div className="detail-layout detail-container">
      {/* ซ้าย */}
      <div>
        <div className="breadcrumb menubar">
          <span>Home </span>&gt;
          <span>Property</span>&gt;
          <span>Room</span>
        </div>
        <div className="gallery-grid gallery-large gallery-grid img gallery-grid img:hover">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
            alt=""
          />
        </div>
        <div>
          <div className="status-form">
            <div className="status-format">
              <SquareCheck />
              <p>Available</p>
            </div>
            <div className="status-format">
              <SquareX />
              <p>Rented</p>
            </div>
          </div>
          <p className="room-title">Room Title (ROOM A2)</p>
        </div>
        <div className="unit-state">
          <div className="unit-status-card">
            <BadgeDollarSign />
            <p>Room Rent</p>
            <p>฿ 9,500 / Month</p>
          </div>
          <div className="unit-status-card">
            <UserRound />
            <p>Capacity</p>
            <p>จำนวนผู้พัก</p>
          </div>
          <div className="unit-status-card">
            <Info />
            <p>Room Status</p>
            <p>สถาณะห้อง</p>
          </div>
        </div>
        <div>
          <div className="booking-form-group label topic">Description</div>
          <div className="booking-summary-table">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
            earum impedit molestias vero natus ex obcaecati doloremque corporis
            sunt a, recusandae asperiores tempora cum suscipit, nisi quis
            laudantium quae. Hic?
          </div>
        </div>
      </div>
      {/* ขวา */}
      <div className="booking-card">
        <div className="menubar">
          <p>Are you interested in this room?</p>
          <p>฿ 9,500 / Month</p>
        </div>
        <button className="booking-primary-btn">Join Request</button>
      </div>
    </div>
  );
}
