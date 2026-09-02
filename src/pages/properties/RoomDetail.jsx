import React from "react";

import "../../index.css";
import SubRoomCard from "../../components/roomDetail/SubRoomCard";

export default function RoomDetail() {
  return (
    <div className="property-detail-page">
      {/* Navbar Header */}
      <header className="public-header">
        <a href="#home" className="public-brand">
          <div className="public-brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7z" />
            </svg>
          </div>
          RoomShare
        </a>
        <nav className="public-navigation">
          <a href="#rent">Rent</a>
          <button className="public-logout-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
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
                อพาร์ตเมนต์ 4 ห้องนอน Ziroom Youjia Beiyuan
              </h1>
              {/* TODO : ใส่ Property address */}
              <p className="property-sub-location">
                ยูนิต 05 · Wangchun Garden
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
                  3 ห้องนอน
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
                    <path d="M4 12h16M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                  </svg>
                  1 ห้องน้ำ
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
                  อพาร์ตเมนต์
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
