import React from "react";
import { MapPin } from "lucide-react";

const locations = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Chitwan",
  "Pokhara",
];

const DeliveryCoverage = () => {
  return (
    <section className="py-20 bg-emerald-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-left mb-4">
          Delivery Coverage
        </h2>
        <p className="text-left text-gray-600 mb-12">
          We currently serve major cities across Nepal with fresh farm products.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left side locations */}
          <div className="space-y-4">
            {locations.map((place, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 border rounded-xl shadow-sm"
              >
                <MapPin className="text-green-600" size={20} />
                <span className="text-lg">{place}</span>
              </div>
            ))}
          </div>

          {/* Right side interactive map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-96">
            <iframe
              title="Nepal Delivery Coverage Map"
              src="https://www.google.com/maps/d/u/0/embed?mid=1VhLzb9WBO_ggYBNdPO3nAgGtCrXIJVs&ehbc=2E312F&noprof=1"
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryCoverage;