

import { Lightbulb, Users, Target, Shield } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description:
      "We push the boundaries of AI technology, constantly exploring new possibilities and creating cutting-edge solutions that define the future of software development.",
  },
  {
    icon: Users,
    title: "Collaborative Excellence",
    description:
      "Our diverse team of experts works seamlessly together, combining their unique perspectives and skills to deliver exceptional results for our clients.",
  },
  {
    icon: Target,
    title: "Impact-Driven",
    description:
      "Every project we undertake aims to create meaningful impact, transforming businesses and industries through the power of artificial intelligence.",
  },
  {
    icon: Shield,
    title: "Ethical AI",
    description:
      "We are committed to developing responsible AI solutions that prioritize transparency, fairness, and the well-being of society.",
  },
];

export function CompanyValues() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Core Values</h2>
          <p className="mt-4 text-gray-500 md:text-xl">
            The principles that guide our innovation and shape our success
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <value.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-500">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
