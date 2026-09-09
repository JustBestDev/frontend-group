import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Building2,
  CircleCheckBig,
  Clock3,
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
          error.response?.data?.message || "Unable to load dashboard";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-105 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#DCE5DF] border-t-forest" />

          <p className="mt-4 text-sm font-medium text-[#7D8981]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
        {error}
      </div>
    );
  }

  const statistics = [
    {
      label: "Total users",
      value: dashboard?.totalUsers ?? 0,
      icon: Users,
      iconClass: "bg-[#EAF0EC] text-[#17382E]",
    },
    {
      label: "Active users",
      value: dashboard?.activeUsers ?? 0,
      icon: CircleCheckBig,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total properties",
      value: dashboard?.totalProperties ?? 0,
      icon: Building2,
      iconClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "Pending properties",
      value: dashboard?.pendingProperties ?? 0,
      icon: House,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      label: "Owner applications",
      value: dashboard?.pendingOwnerApplications ?? 0,
      icon: FileClock,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      label: "Open communities",
      value: dashboard?.openCommunityPosts ?? 0,
      icon: UsersRound,
      iconClass: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Page heading */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#829087]">
          Administration
        </p>

        <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E2F27] sm:text-3xl">
              Dashboard overview
            </h1>

            <p className="mt-2 text-sm text-[#7B8780]">
              Monitor users, properties and activity across RoomHub.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E2E8E3] bg-white px-4 py-2.5 text-sm text-[#69766E] shadow-sm">
            <Clock3 size={16} />

            <span>Platform overview</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statistics.map((statistic) => {
          const Icon = statistic.icon;

          return (
            <article
              key={statistic.label}
              className="group rounded-2xl border border-[#E4E9E4] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#7B8780]">
                    {statistic.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-[#1E2F27]">
                    {statistic.value}
                  </p>
                </div>

                <div
                  className={`grid size-11 shrink-0 place-items-center rounded-xl ${statistic.iconClass}`}
                >
                  <Icon size={21} strokeWidth={1.9} />
                </div>
              </div>

              <div className="mt-5 h-1 rounded-full bg-[#F0F3F0]">
                <div className="h-full w-2/3 rounded-full bg-sage" />
              </div>
            </article>
          );
        })}
      </div>

      {/* Main dashboard cards */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        {/* Pending reviews */}
        <article className="overflow-hidden rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-[#EEF1EE] px-6 py-5">
            <div>
              <h2 className="font-semibold text-[#25372E]">
                Pending reviews
              </h2>

              <p className="mt-1 text-sm text-[#879189]">
                Items that require administrator action
              </p>
            </div>

            <span className="rounded-full bg-[#EEF3EF] px-3 py-1 text-xs font-semibold text-[#3E5D4D]">
              {(dashboard?.pendingOwnerApplications ?? 0) +
                (dashboard?.pendingProperties ?? 0)}{" "}
              pending
            </span>
          </div>

          <div className="divide-y divide-[#EEF1EE]">
            <Link
              to="/admin/owner-applications"
              className="group flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-[#FAFBFA]"
            >
              <div className="flex items-center gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-violet-50 text-violet-600">
                  <FileClock size={20} />
                </div>

                <div>
                  <p className="font-semibold text-[#293A31]">
                    Owner applications
                  </p>

                  <p className="mt-1 text-sm text-[#879189]">
                    Verification requests awaiting review
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid min-w-8 place-items-center rounded-lg bg-[#F1F4F1] px-2 py-1 text-sm font-semibold text-[#31483C]">
                  {dashboard?.pendingOwnerApplications ?? 0}
                </span>

                <ArrowRight
                  size={18}
                  className="text-[#9AA39D] transition group-hover:translate-x-1 group-hover:text-forest"
                />
              </div>
            </Link>

            <Link
              to="/admin/properties"
              className="group flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-[#FAFBFA]"
            >
              <div className="flex items-center gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-orange-50 text-orange-600">
                  <Building2 size={20} />
                </div>

                <div>
                  <p className="font-semibold text-[#293A31]">
                    Property listings
                  </p>

                  <p className="mt-1 text-sm text-[#879189]">
                    Listings awaiting publication approval
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid min-w-8 place-items-center rounded-lg bg-[#F1F4F1] px-2 py-1 text-sm font-semibold text-[#31483C]">
                  {dashboard?.pendingProperties ?? 0}
                </span>

                <ArrowRight
                  size={18}
                  className="text-[#9AA39D] transition group-hover:translate-x-1 group-hover:text-forest"
                />
              </div>
            </Link>
          </div>
        </article>

        {/* Platform activity */}
        <article className="rounded-2xl border border-[#E4E9E4] bg-white shadow-sm">
          <div className="border-b border-[#EEF1EE] px-6 py-5">
            <h2 className="font-semibold text-[#25372E]">
              Platform activity
            </h2>

            <p className="mt-1 text-sm text-[#879189]">
              Current RoomHub activity
            </p>
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-2xl bg-[#F6F8F6] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#78857D]">
                    Active rentals
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#203229]">
                    {dashboard?.activeRentals ?? 0}
                  </p>
                </div>

                <div className="grid size-12 place-items-center rounded-xl bg-white text-forest shadow-sm">
                  <House size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F6F8F6] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#78857D]">
                    Open communities
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#203229]">
                    {dashboard?.openCommunityPosts ?? 0}
                  </p>
                </div>

                <div className="grid size-12 place-items-center rounded-xl bg-white text-forest shadow-sm">
                  <UsersRound size={22} />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default AdminDashboard;