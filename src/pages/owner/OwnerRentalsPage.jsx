import { CalendarDays, ReceiptText } from "lucide-react";
import { useEffect, useState } from "react";
import useOwnerStore from "../../stores/ownerStore.js";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Ongoing";
const OwnerRentalsPage = () => {
  const { rentals, rentalPagination, isLoading, error, getMyRentals } = useOwnerStore();
  const [status, setStatus] = useState("");
  useEffect(() => { getMyRentals({ status: status || undefined, page: 1, limit: 20 }).catch(() => { }); }, [getMyRentals, status]);
  return <section className="owner-resource-page mx-auto w-full max-w-330">
    <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
      <div>
        <p className="owner-eyebrow">Leases</p>
        <h1>Rentals</h1>
        <p>Track rental periods and their current status.</p>
      </div>
      <label className="owner-select grid gap-1 text-xs text-muted-copy">
        <span>Status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option><option>PENDING</option><option>ACTIVE</option>
          <option>COMPLETED</option>
          <option>CANCELLED</option>
        </select>
      </label>
    </header>
    <div className="owner-stat-grid mb-4.5 grid grid-cols-3 gap-3.5 max-md:grid-cols-1">
      <article>
        <span><ReceiptText size={20} /></span>
        <div>
          <p>Total rentals</p>
          <strong>{rentalPagination?.total ?? rentals.length}</strong>
        </div>
      </article>
      <article>
        <span><CalendarDays size={20} /></span>
        <div>
          <p>Active</p>
          <strong>{rentals.filter((rental) => rental.status === "ACTIVE").length}</strong>
        </div>
      </article>
      <article>
        <span><ReceiptText size={20} /></span>
        <div>
          <p>Pending</p>
          <strong>{rentals.filter((rental) => rental.status === "PENDING").length}</strong>
        </div>
      </article>
    </div>
    {error &&
      <p className="owner-alert rounded-xl bg-[#fde8e6] px-3.5 py-3 text-danger" role="alert">{error}</p>
    }
    {isLoading ?
      <div className="owner-loading grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
        Loading rentals...
      </div> : rentals.length === 0 ?
        <div className="owner-empty-state grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
          <ReceiptText size={42} />
          <h2>No rentals found</h2>
          <p>Rental agreements will appear here.</p>
        </div> :
        <div className="owner-table-wrap overflow-x-auto rounded-xl border border-line bg-surface shadow-[0_5px_16px_rgba(50,66,54,.05)]">
          <table className="owner-table w-full border-collapse">
            <thead>
              <tr>
                <th>Property / room</th>
                <th>Rental period</th>
                <th>Monthly rent</th>
                <th>Members</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((rental) =>
                <tr key={rental.id}>
                  <td>
                    <strong>{rental.property?.title || `Property #${rental.propertyId}`}</strong>
                    <small>{rental.room?.roomName || "Whole property"}</small>
                  </td>
                  <td>
                    {formatDate(rental.startDate)}{formatDate(rental.endDate)}
                  </td>
                  <td>
                    {Number(rental.monthlyRent || 0).toLocaleString()}
                  </td>
                  <td>
                    {rental.members?.length || 0}
                  </td>
                  <td>
                    <span className={`owner-status status-${rental.status?.toLowerCase()}`}>
                      {rental.status}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>}
  </section>;
};
export default OwnerRentalsPage;

