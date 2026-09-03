import { BedDouble, Building2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useOwnerStore from "../../stores/ownerStore.js";

const OwnerRoomsPage = () => {
  const { properties, isLoading, error, getMyProperties } = useOwnerStore();
  const [propertyId, setPropertyId] = useState("ALL");

  useEffect(() => { getMyProperties().catch(() => { }); }, [getMyProperties]);

  const rooms = useMemo(() => properties.flatMap((property) => (property.rooms || [])
    .map((room) => ({ ...room, propertyTitle: property.title, propertyId: property.id })))
    .filter((room) => propertyId === "ALL" || String(room.propertyId) === propertyId), [properties, propertyId]);

  const counts = ["AVAILABLE", "RESERVED", "RENTED"].map((status) => ({ status, count: rooms.filter((room) => room.status === status).length }));

  return <section className="owner-resource-page mx-auto w-full max-w-330">
    <header className="owner-resource-header mb-6 flex items-end justify-between gap-6 max-md:flex-col max-md:items-stretch">
      <div>
        <p className="owner-eyebrow">Inventory</p>
        <h1>Rooms</h1>
        <p>See every room across your properties and its current availability.</p>
      </div>
      <label className="owner-select grid gap-1 text-xs text-muted-copy">
        <span>Property</span><select value={propertyId} onChange={(event) => setPropertyId(event.target.value)}>
          <option value="ALL">All properties</option>
          {properties.map((property) => <option value={property.id} key={property.id}>{property.title}</option>)}
        </select>
      </label>
    </header>

    <div className="owner-stat-grid mb-4.5 grid grid-cols-3 gap-3.5 max-md:grid-cols-1">
      {counts.map(({ status, count }) => <article key={status}><span><BedDouble size={20} />
      </span>
        <div>
          <p>{status.toLowerCase()}</p><strong>{count}</strong>
        </div>
      </article>
      )}
    </div>

    {error &&
      <p className="owner-alert rounded-xl bg-[#fde8e6] px-3.5 py-3 text-danger" role="alert">{error}</p>}
    {isLoading ?
      <div className="owner-loading grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy">
        Loading rooms...
      </div> :
      rooms.length === 0 ?
        <div className="owner-empty-state grid min-h-72.5 place-content-center justify-items-center rounded-2xl border border-line bg-surface p-8 text-center text-muted-copy"><Building2 size={42} />
          <h2>No rooms found</h2>
          <p>Rooms will appear after they are added to a property.</p>
        </div> :
        <div className="owner-table-wrap overflow-x-auto rounded-xl border border-line bg-surface shadow-[0_5px_16px_rgba(50,66,54,.05)]">
          <table className="owner-table w-full border-collapse">
            <thead>
              <tr>
                <th>Room</th>
                <th>Property</th>
                <th>Capacity</th>
                <th>Monthly rent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) =>
                <tr key={room.id}>
                  <td><strong>{room.roomName}</strong><small>{room.description || "No description"}</small></td>
                  <td>{room.propertyTitle}</td>
                  <td>{room.capacity || "โ€”"}</td>
                  <td>เธฟ{Number(room.monthlyRent || 0).toLocaleString()}</td>
                  <td><span className={`owner-status status-${room.status?.toLowerCase()}`}>{room.status}</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    }
  </section>;
};
export default OwnerRoomsPage;

