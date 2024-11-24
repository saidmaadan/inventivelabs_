import { Metadata } from "next";
import { ServiceCard } from "@/components/services/service-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service, ServiceCategory } from "@/types/service";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Services - InventiveLabs",
  description: "Explore our comprehensive range of software development, design, and consulting services.",
};

// This would typically come from your database or CMS
const services: Service[] = [
  {
    id: "1",
    title: "Web Development",
    description: "Modern, responsive web applications built with cutting-edge technologies.",
    icon: "🌐",
    features: [
      "Full-stack development",
      "Progressive Web Apps (PWA)",
      "Responsive design",
      "Performance optimization",
    ],
    benefits: [
      "Increased user engagement",
      "Better conversion rates",
      "Improved SEO rankings",
      "Cross-platform compatibility",
    ],
    category: "development",
    slug: "web-development",
    order: 1,
  },
  {
    id: "2",
    title: "UI/UX Design",
    description: "User-centered design solutions that create engaging digital experiences.",
    icon: "🎨",
    features: [
      "User research",
      "Wireframing & prototyping",
      "Visual design",
      "Usability testing",
    ],
    benefits: [
      "Enhanced user satisfaction",
      "Reduced development costs",
      "Higher user retention",
      "Stronger brand identity",
    ],
    category: "design",
    slug: "ui-ux-design",
    order: 2,
  },
  {
    id: "3",
    title: "Technical Consulting",
    description: "Expert guidance on technology strategy and implementation.",
    icon: "💡",
    features: [
      "Architecture review",
      "Technology assessment",
      "Performance optimization",
      "Security audits",
    ],
    benefits: [
      "Informed decision making",
      "Risk mitigation",
      "Cost optimization",
      "Improved efficiency",
    ],
    category: "consulting",
    slug: "technical-consulting",
    order: 3,
  },
  {
    id: "4",
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: "📱",
    features: [
      "Native iOS & Android",
      "Cross-platform solutions",
      "App store optimization",
      "Push notifications",
    ],
    benefits: [
      "Wider market reach",
      "Native performance",
      "Offline capabilities",
      "Platform-specific features",
    ],
    category: "development",
    slug: "mobile-development",
    order: 4,
  },
];

const categories: { value: ServiceCategory; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "consulting", label: "Consulting" },
  { value: "maintenance", label: "Maintenance" },
];

interface ServicesPageProps {
  searchParams: {
    category?: ServiceCategory;
  };
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  const filteredServices = searchParams.category
    ? services.filter((service) => service.category === searchParams.category)
    : services;

  return (
    <div className="container py-10 px-8 md:px-16 lg:px-20 mx-auto">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          We offer a comprehensive range of software development, design, and consulting
          services to help your business thrive in the digital age.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        <Link
          href="/services"
          className={cn(
            buttonVariants({ variant: !searchParams.category ? "default" : "outline" }),
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/services?category=${category.value}`}
            className={cn(
              buttonVariants({
                variant: searchParams.category === category.value ? "default" : "outline",
              }),
            )}
          >
            {category.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
