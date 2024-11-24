import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { OfficeLocation } from "@/components/contact/office-location";
import type { OfficeLocation as OfficeLocationType } from "@/types/contact";

export const metadata: Metadata = {
  title: "Contact Us - InventiveLabs",
  description: "Get in touch with us for any inquiries about our services, projects, or collaboration opportunities.",
};

// This would typically come from your CMS or database
const offices: OfficeLocationType[] = [
  {
    id: "1",
    name: "Austin TX Office",
    address: "600 Congress Avenue",
    city: "Austin",
    state: "TX",
    country: "United States",
    postalCode: "78701",
    phone: "+1 (737) 275-8095",
    email: "info[at]inventivelabs.com",
    
  },
  // {
  //   id: "2",
  //   name: "New York Office",
  //   address: "456 Innovation Avenue",
  //   city: "New York",
  //   state: "NY",
  //   country: "United States",
  //   postalCode: "10001",
  //   phone: "+1 (555) 987-6543",
  //   email: "ny@inventivelabs.com",
  //   coordinates: {
  //     lat: 40.7128,
  //     lng: -74.0060,
  //   },
  // },
];

export default function ContactPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Have a question or want to work together? We'd love to hear from you.
          Get in touch with us using the form below or visit one of our offices.
        </p>
      </div>
      
      {/* Grid layout with 2 columns on large screens, reversed order */}
      <div className="grid gap-10 md:grid-cols-[260px_1fr] lg:grid-cols-[350px_1fr]">
        
          
          
        <div className="space-y-6">
          {offices.map((office) => (
            <Card key={office.id}>
              <CardContent className="p-6">
                <OfficeLocation office={office} />
              </CardContent>
            </Card>
          ))}
        </div>  
        <Card>
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
