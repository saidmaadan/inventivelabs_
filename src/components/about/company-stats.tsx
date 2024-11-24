'use client';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    number: "98%",
    label: "Client Satisfaction",
  },
  {
    number: "200+",
    label: "AI Projects Delivered",
  },
  {
    number: "50+",
    label: "Enterprise Clients",
  },
  {
    number: "24/7",
    label: "Global Support",
  },
];

export function CompanyStats() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container px-4 md:px-6">
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-primary-foreground/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
