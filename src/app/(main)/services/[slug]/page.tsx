import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Service } from "@/types/service";

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
  // ... other services
];

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    return {
      title: "Service Not Found - InventiveLabs",
    };
  }

  return {
    title: `${service.title} - InventiveLabs Services`,
    description: service.description,
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="container py-10">
      <Button
        variant="ghost"
        asChild
        className="mb-8 hover:bg-transparent hover:text-primary"
      >
        <Link href="/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <div>
                  <CardTitle className="text-3xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-lg">
                    {service.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-4 rounded-lg border"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Benefits</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {service.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-4 rounded-lg border"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Ready to transform your business with our {service.title.toLowerCase()}
                services? Get in touch with us today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
