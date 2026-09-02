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
            {/* TODO : roomname */}
          <h3>ห้องนอน 1</h3>
          <span className="room-tag tag-available">ว่าง</span>
        </div>
        {/* TODO : Monthly Rent */}
        <div className="room-price">
          ฿9,500 <span>/ เดือน</span>
        </div>
        {/* Discription */}
        <div className="room-features">
          เตียงเดี่ยว · ตู้เสื้อผ้า · โต๊ะทำงาน
        </div>
      </div>
      <div className="room-card-action">
      </div>
    </div>
  );
}
