import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    number: 500,
    suffix: "+",
    label: "Farmers Empowered",
  },
  {
    number: 1000,
    suffix: "+",
    label: "Products Listed",
  },
  {
    number: 50,
    suffix: "+",
    label: "Locations Covered",
  },
  {
    number: 2000,
    suffix: "+",
    label: "Happy Customers",
  }
];

const FarmerSuccessSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl text-left font-semibold text-green-800 mb-4">
          Our Impact in Numbers
        </h2>
        <p className="text-gray-600 text-left mb-12 text-lg">
          More than 500 local farmers are earning better income through our
          platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition duration-300"
            >
              <h3 className="text-4xl font-semibold text-green-700 mb-3">
                {inView ? (
                  <CountUp
                    start={0}
                    end={item.number}
                    duration={2.5}
                    suffix={item.suffix}
                  />
                ) : (
                  "0"
                )}
              </h3>
              <p className="text-gray-700 text-lg">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FarmerSuccessSection;