import React from "react";

import "../../styles/pages/room-detail.css";
import SubRoomCard from "../../components/roomDetail/SubRoomCard";

export default function RoomDetail() {
  return (
    <div className="property-detail-page">
      {/* Navbar Header */}
      <header className="public-header">
        <Link className="public-brand" to="/properties">
          <div className="public-brand-icon">
            <Building2 size={24} />
          </div>ß

          <span>RoomShare</span>
        </Link>

        <nav className="public-navigation">
          <Link to="/properties">Properties</Link>
          <Link to="/login">Log in</Link>
        </nav>
      </header>

      {/* Main Container */}
      <main className="detail-container">
        {/* Breadcrumb Header */}
        <nav className="breadcrumb">
          <a href="#home">หน้าหลัก</a>
          <span className="separator">&gt;</span>
          <a href="#apartments">อพาร์ตเมนต์</a>
          <span className="separator">&gt;</span>
          <a href="#ziroom">Ziroom Youjia Beiyuan</a>
          <span className="separator">&gt;</span>
          <span className="current">ยูนิต 05</span>
        </nav>

        {/* Content Layout */}
        <div className="detail-layout">
          {/* Left Column (Main Info) */}
          <div className="detail-main">
            {/* Image Gallery */}
            {/* Photo from Cloudinary */}
            <div className="gallery-grid">
              <div className="gallery-large">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                  alt="Living room"
                />
              </div>
              <div className="gallery-thumb">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80"
                  alt="Kitchen"
                />
              </div>
              <div className="gallery-thumb">
                <img
                  src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=80"
                  alt="Bedroom main"
                />
              </div>
              <div className="gallery-thumb">
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"
                  alt="Bathroom"
                />
              </div>
              <div className="gallery-thumb">
                <img
                  src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80"
                  alt="Working desk"
                />
              </div>
            </div>

            {/* Property Title & Summary */}
            <div className="property-header-info">
              {/* TODO : titile ของ Property */}
              <h1 className="property-main-title">
                {property.title}
              </h1>
              {/* TODO : ใส่ Property address */}
              <p className="property-sub-location">
                {property.address}
              </p>
              <div className="property-specs">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                  20.6 ตร.ม.
                </span>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 4v16M2 8h20M2 16h20M22 4v16" />
                  </svg>
                  {rooms.length}
                </span>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 21h18M3 7v14M21 7v14M6 3h12v4H6z" />
                  </svg>
                  {property.propertyType || "Property"}
                </span>
              </div>
              {/* TODO : Price / Monthy Rent / Rent type */}
              <div className="property-main-price">
                <strong>฿27,600</strong> / Monuth (ทั้งยูนิต)
              </div>
            </div>

            {/* Unit Status */}
            {/* TODO : เอา status ห้องมาโชว์ */}
            <div className="unit-status-card">
              <h3>สถานะห้องในยูนิต</h3>
              <div className="status-chips">
                <span className="chip chip-available">ว่าง 2 ห้อง</span>
                <span className="chip chip-occupied">มีผู้เช่าแล้ว 1 ห้อง</span>
              </div>
            </div>

            {/* Bedroom List */}
            {/* TODO : map ข้อมูลที่สร้างห้องย่อยออกมา */}
            <div className="bedroom-section">
              <h2>เลือกห้องนอน</h2>
              <SubRoomCard />
              <SubRoomCard />
              <SubRoomCard />
            </div>
          </div>

          {/* Right Column (Sidebar Booking Card) */}
          <aside className="detail-sidebar">
            <div className="booking-card">
              <h2>สนใจห้องนี้?</h2>
              <div className="booking-price">
                <span>เริ่มต้น </span>
                <strong>฿9,000</strong>
                <span> / เดือน</span>
              </div>

              <div className="booking-form-group">
                <label>เลือกห้องนอน</label>
                <select className="booking-select" defaultValue="1">
                  <option value="1">ห้องนอน 1 (฿9,500/เดือน)</option>
                  <option value="3">ห้องนอน 3 (฿9,100/เดือน)</option>
                </select>
              </div>
              {/* TODO : ส่งคำขอไปยัง Owner */}
              <button className="booking-primary-btn">ส่งคำขอเช่าห้อง</button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>RoomMate</strong>
            <p>© 2024 RoomMate Thailand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
