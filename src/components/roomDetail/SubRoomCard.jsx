import React from "react";

export default function SubRoomCard() {
  return (
    // Photo from Cloudinary
    <div className="room-card">
      <img
        src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=200&q=80"
        alt="ห้องนอน 1"
        className="room-card-img"
      />
      <div className="room-card-info">
        <div className="room-card-header">
          <h3>Room A1</h3>
          <span>AVAILABLE</span>
        </div>
        <div className="room-price">
          ฿9000
          <span>/ Mounth</span>
        </div>
        {/* Discription */}
        <div className="room-features">3Rooms 2Bad</div>
      </div>
      {/* TODO : เพิ่มุปุ่ม Edit กับ Delect และกำหนดให้ Owner เห็นเท่านั้น */}
      <div className="room-card-action"></div>
    </div>
  );
}
