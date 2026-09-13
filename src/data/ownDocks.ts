export type OwnDock = {
  id: string;
  name: string;
  housing: string;
  image: string;
  alt: string;
};

export const OWN_DOCKS: OwnDock[] = [
  {
    id: "asic-70",
    name: "Asics 70 TH/s",
    housing: "7x40 Feet containers",
    image: "/docks/asic-70.jpg",
    alt: "Cooling fan wall for Asics 70 TH/s docks",
  },
  {
    id: "asic-110",
    name: "Asics 110 TH/s",
    housing: "7x40 Feet containers",
    image: "/docks/asic-110.jpg",
    alt: "Container hall racks for Asics 110 TH/s docks",
  },
  {
    id: "asic-420",
    name: "Asics 420 TH/s",
    housing: "7x40 Feet containers",
    image: "/docks/asic-420.jpg",
    alt: "Rack of Asics 420 TH/s miners",
  },
];

export function dockInquirePath(id: string) {
  return `/app/support?dock=${encodeURIComponent(id)}`;
}

export function dockInquireCopy(dock: OwnDock) {
  return {
    subject: `Own a dock — ${dock.name}`,
    body: `I want to inquire about buying a ${dock.name} dock in ${dock.housing}.`,
  };
}
