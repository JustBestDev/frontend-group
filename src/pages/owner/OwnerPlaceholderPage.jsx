import { ArrowLeft, Construction } from "lucide-react";
import { Link, useLocation } from "react-router";

const OwnerPlaceholder = () => {
  const section = useLocation().pathname.split("/").filter(Boolean).pop()?.replaceAll("-", " ");
  return <section className="owner-placeholder"><Construction size={40} /><p className="owner-eyebrow">Owner portal</p>
    <h1>{section || "Owner"}</h1><p>This section is ready for the next development phase.</p>
    <Link to="/owner"><ArrowLeft size={17} />Back to overview</Link></section>;
};

export default OwnerPlaceholder;
