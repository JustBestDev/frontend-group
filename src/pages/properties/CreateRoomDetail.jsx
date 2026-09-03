import React, { useState } from "react";
import {
  DoorOpen,
  Banknote,
  Users,
  ImagePlus,
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import "../../styles/pages/createRoomDetail.css";

export default function CreateRoomDetail() {
  const [roomStatus, setRoomStatus] = useState("available");

  return (
    <div className="create-room-page">
      <div>
        <header className="breadcrumb menubar">
          <span>Home </span>&gt;
          <span>Property</span>&gt;
          <span>Room</span>&gt;
          <span>Add Sub-Unit</span>
        </header>
        {/* Room Information */}
        <div className="add-room-page">
          {/* =========================
          Page Header
      ========================= */}
          <div className="add-room-header">
            <div>
              <h1>Add Room</h1>

              <p>Add new rooms to your unit</p>
            </div>

            <button className="back-button">← &nbsp; Back to the Unit</button>
          </div>

          {/* =========================
          1. ข้อมูลห้อง
      ========================= */}
          <section className="room-section">
            <div className="section-header">
              <div className="section-icon">
                <DoorOpen size={27} strokeWidth={2.2} />
              </div>

              <h2>1. Room Information</h2>
            </div>

            <div className="section-divider" />

            <div className="section-form two-columns">
              {/* ชื่อห้อง */}
              <div className="form-group">
                <label>
                  Room Title <span>*</span>
                </label>

                <input type="text" placeholder="Exanple : Room A1" />

                <div className="form-helper">
                  <span>
                    Name the rooms so that tenants can easily distinguish them.
                  </span>

                  <span>0 / 100</span>
                </div>
              </div>

              {/* รายละเอียด */}
              <div className="form-group">
                <label>
                  Room Descreiption <small>(No Require)</small>
                </label>

                <textarea
                  placeholder="Describe the room, including its size, features, layout, and other important information for tenants.
"
                />

                <div className="form-helper">
                  <span>Add more details about this room.</span>

                  <span>0 / 500</span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
          2. ข้อมูลการเช่าและสถานะ
      ========================= */}
          <section className="room-section">
            <div className="section-header">
              <div className="section-icon">
                <Banknote size={27} strokeWidth={2.2} />
              </div>

              <h2>2. Rental Information & Status</h2>
            </div>

            <div className="section-divider" />

            <div className="section-form two-columns">
              {/* ค่าเช่า */}
              <div className="form-group">
                <label>
                  Monthly Rent <span>*</span>
                </label>

                <div className="price-input">
                  <div className="price-prefix">฿</div>

                  <input type="text" value="0.00" readOnly />

                  <div className="price-suffix">/ Month</div>
                </div>

                <div className="form-helper">
                  <span>Set the monthly rent for this room.</span>
                </div>
              </div>

              {/* สถานะห้อง */}
              <div className="form-group">
                <label>
                  Room Status <span>*</span>
                </label>

                <div className="room-status-options">
                  {/* ห้องว่าง */}
                  <button
                    type="button"
                    className={`status-card ${roomStatus === "available" ? "active" : ""}`}
                    onClick={() => setRoomStatus("available")}
                  >
                    <div>
                      <div className="status-title">
                        <span className="status-dot available" />

                        <strong>Available</strong>
                      </div>

                      <p>This room is available for Rent</p>
                    </div>

                    {roomStatus === "available" && (
                      <CheckCircle2
                        className="status-check"
                        size={24}
                        strokeWidth={2}
                      />
                    )}
                  </button>

                  {/* มีผู้เช่าแล้ว */}
                  <button
                    type="button"
                    className={`status-card ${roomStatus === "rented" ? "active" : ""}`}
                    onClick={() => setRoomStatus("rented")}
                  >
                    <div>
                      <div className="status-title">
                        <span className="status-dot rented" />

                        <strong>Rented</strong>
                      </div>

                      <p>This room is currently occupied.</p>
                    </div>

                    {roomStatus === "rented" && (
                      <CheckCircle2
                        className="status-check"
                        size={24}
                        strokeWidth={2}
                      />
                    )}
                  </button>
                </div>

                <div className="form-helper">
                  <span>Set the current status of the room.</span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
          3. จำนวนผู้พัก
      ========================= */}
          <section className="room-section">
            <div className="section-header">
              <div className="section-icon">
                <Users size={27} strokeWidth={2.2} />
              </div>

              <h2>3. Number of Residents</h2>
            </div>

            <div className="section-divider" />

            <div className="form-group guest-group">
              <label>
                Max. Resident <small>(No Require)</small>
              </label>

              <div className="guest-input">
                <input type="text" value="Example : 1 person" readOnly />

                <div className="guest-suffix">Person</div>
              </div>

              <div className="form-helper">
                <span>
                  Specify the maximum number of occupants allowed in this room.
                  (Leave blank if not specified.)
                </span>
              </div>
            </div>
          </section>

          {/* =========================
          4. รูปภาพห้อง
      ========================= */}
          <section className="room-section image-section">
            <div className="section-header">
              <div className="section-icon">
                <ImagePlus size={27} strokeWidth={2.2} />
              </div>

              <h2>4. Room Photos</h2>
            </div>

            <div className="section-divider" />

            <p className="image-description">
              Add photos to help tenants get a better view of your room.
            </p>

            <div className="upload-layout">
              {/* Upload */}
              <div className="upload-box">
                <UploadCloud
                  size={36}
                  strokeWidth={1.8}
                  className="upload-icon"
                />

                <strong>Click or drag and drop files here.</strong>

                <span>
                  Supports JPG, PNG, and WebP files (up to 10 MB per file).
                  Upload 4–8 images.
                </span>
              </div>

              {/* คำแนะนำ */}
              <div className="image-tips">
                <div className="tips-title">
                  <span className="info-icon">i</span>

                  <strong>Recommendations</strong>
                </div>

                <ul>
                  <li>
                    <CheckCircle2 size={14} />
                    Room Front Photo
                  </li>

                  <li>
                    <CheckCircle2 size={14} />
                    Bedroom Furniture
                  </li>

                  <li>
                    <CheckCircle2 size={14} />
                    Different Views of the Room
                  </li>

                  <li>
                    <CheckCircle2 size={14} />
                    Windows / View (if applicable)
                  </li>

                  <li>
                    <CheckCircle2 size={14} />
                    Lighting in the Room
                  </li>
                </ul>
              </div>
            </div>

            {/* Preview */}
            <div className="preview-area">
              <h4>Photo Examples</h4>

              <div className="preview-grid">
                <div className="image-placeholder">+</div>

                <div className="image-placeholder">+</div>

                <div className="image-placeholder">+</div>

                <div className="image-placeholder">+</div>

                <div className="image-placeholder">+</div>

                <div className="image-placeholder">+</div>
              </div>
            </div>
          </section>

          {/* =========================
          Bottom Action
      ========================= */}
          <div className="add-room-footer">
            <button className="cancel-button">Cancel</button>

            <button className="submit-button">⊙ &nbsp; Add Room</button>
          </div>
        </div>
      </div>
    </div>
  );
}
