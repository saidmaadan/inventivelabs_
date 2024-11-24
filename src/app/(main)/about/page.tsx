import { Metadata } from "next";
import Image from "next/image";
import { CompanyValues } from "@/components/about/company-values";
import { CompanyStats } from "@/components/about/company-stats";
import { TeamSection } from "@/components/about/team-section";

export const metadata: Metadata = {
  title: "About Us | InventiveLabs - Leading AI Software Development Company",
  description:
    "Learn about InventiveLabs, a pioneering AI software development company delivering cutting-edge solutions for enterprises worldwide.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/hero-bg.jpg"
            alt="InventiveLabs office"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 container px-4 md:px-6 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Pioneering the Future of AI
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            We're a team of visionary engineers and researchers pushing the boundaries
            of artificial intelligence to solve complex business challenges.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl">
                At InventiveLabs, we're on a mission to democratize artificial
                intelligence and empower businesses to harness its transformative
                potential. Through innovative solutions and ethical practices, we're
                building a future where AI drives sustainable growth and positive
                change.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-gray-600">
                    Developing cutting-edge AI solutions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-gray-600">
                    Fostering innovation through research
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <p className="text-gray-600">
                    Building ethical and responsible AI
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/about/mission.jpg"
                alt="Our mission"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <CompanyValues />

      {/* Stats Section */}
      <CompanyStats />

      {/* Team Section */}
      {/* <TeamSection /> */}

      {/* Office Locations */}
      {/* <section className="py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Global Presence
            </h2>
            <p className="mt-4 text-gray-500 md:text-xl">
              Serving clients worldwide from our strategic locations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">San Francisco</h3>
              <p className="text-gray-500">Global Headquarters</p>
              <p className="mt-4 text-gray-600">
                123 Innovation Drive
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">London</h3>
              <p className="text-gray-500">European Operations</p>
              <p className="mt-4 text-gray-600">
                45 Tech Square
                <br />
                London, EC2A 4NE
                <br />
                United Kingdom
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">Singapore</h3>
              <p className="text-gray-500">Asia-Pacific Hub</p>
              <p className="mt-4 text-gray-600">
                78 Innovation Way
                <br />
                Singapore 018960
                <br />
                Singapore
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  );
}
