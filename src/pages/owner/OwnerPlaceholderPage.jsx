import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router";

const OwnerPlaceholder = () => {
  const pathname = useLocation().pathname;
  const pageTitles = {
    "/owner/properties": "My Properties",
    "/owner/properties/new": "Create Property",
    "/owner/rooms": "Rooms",
    "/owner/rentals": "Rentals",
    "/owner/messages": "Messages",
    "/owner/profile": "Profile",
  };
  const section = pageTitles[pathname] || "Owner";

  return <section className="grid min-h-[calc(100vh-70px)] place-content-center justify-items-center text-center text-muted-copy">
    <Construction size={40} aria-hidden="true" />
    <p className="mb-2 mt-4 text-[11px] font-extrabold uppercase tracking-[.16em] text-sage-dark">Owner portal</p>
    <h1 className="m-0 font-serif text-4xl capitalize text-ink">{section}</h1>
    <p className="mb-4.5 mt-2">This section is ready for the next development phase.</p>
    <Link className="flex items-center gap-2 font-bold text-sage-dark hover:text-terracotta" to="/owner"><ArrowLeft size={17} aria-hidden="true" />Back to overview</Link>
  </section>;
};

export default OwnerPlaceholder;

