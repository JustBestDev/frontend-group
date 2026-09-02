import { useEffect, useState } from "react";
import {
  Building2,
  CircleCheckBig,
  FileClock,
  House,
  Users,
  UsersRound,
} from "lucide-react";
import api from "../../services/api.js";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get("/admin/dashboard");

        setDashboard(response.data.data);
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Unable to load dashboard";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="admin-page-state">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-state error">
        {error}
      </div>
    );
  }

  const statistics = [
    {
      label: "Total users",
      value: dashboard?.totalUsers ?? 0,
      icon: Users,
      color: "sage",
    },
    {
      label: "Active users",
      value: dashboard?.activeUsers ?? 0,
      icon: CircleCheckBig,
      color: "green",
    },
    {
      label: "Total properties",
      value: dashboard?.totalProperties ?? 0,
      icon: Building2,
      color: "terracotta",
    },
    {
      label: "Pending properties",
      value: dashboard?.pendingProperties ?? 0,
      icon: House,
      color: "beige",
    },
    {
      label: "Owner applications",
      value: dashboard?.pendingOwnerApplications ?? 0,
      icon: FileClock,
      color: "pink",
    },
    {
      label: "Open communities",
      value: dashboard?.openCommunityPosts ?? 0,
      icon: UsersRound,
      color: "navy",
    },
  ];

  return (
    <section className="admin-dashboard">
      <header className="admin-page-header">
        <div>
          <p className="admin-eyebrow">
            RoomShare administration
          </p>

          <h2>Dashboard overview</h2>

          <p>
            Monitor users, properties and community activity.
          </p>
        </div>

        <div className="admin-profile">
          <div className="admin-profile-avatar">
            A
          </div>

          <div>
            <strong>Administrator</strong>
            <span>ADMIN</span>
          </div>
        </div>
      </header>

      <div className="admin-stat-grid">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className="admin-stat-card"
            >
              <div
                className={`admin-stat-icon ${statistic.color}`}
              >
                <Icon size={22} />
              </div>

              <div>
                <span>{statistic.label}</span>
                <strong>{statistic.value}</strong>
              </div>
            </article>
          );
        })}
      </div>

      <div className="admin-dashboard-grid">
        <article className="admin-content-card">
          <div className="admin-card-heading">
            <div>
              <h3>Pending reviews</h3>
              <p>Items that require administrator action</p>
            </div>
          </div>

          <div className="admin-review-list">
            <div className="admin-review-item">
              <div>
                <strong>Owner applications</strong>
                <span>Verification requests awaiting review</span>
              </div>

              <span className="admin-count-badge">
                {dashboard?.pendingOwnerApplications ?? 0}
              </span>
            </div>

            <div className="admin-review-item">
              <div>
                <strong>Property listings</strong>
                <span>Listings awaiting publication approval</span>
              </div>

              <span className="admin-count-badge">
                {dashboard?.pendingProperties ?? 0}
              </span>
            </div>
          </div>
        </article>

        <article className="admin-content-card">
          <div className="admin-card-heading">
            <div>
              <h3>Platform activity</h3>
              <p>Current RoomShare activity</p>
            </div>
          </div>

          <div className="admin-activity-summary">
            <div>
              <span>Active rentals</span>
              <strong>{dashboard?.activeRentals ?? 0}</strong>
            </div>

            <div>
              <span>Open communities</span>
              <strong>
                {dashboard?.openCommunityPosts ?? 0}
              </strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdminDashboard;