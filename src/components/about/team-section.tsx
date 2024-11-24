import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Executive Officer",
    image: "/team/ceo.jpg",
    bio: "Former AI Research Lead at Google Brain with 15+ years of experience in artificial intelligence and machine learning.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Michael Rodriguez",
    role: "Chief Technology Officer",
    image: "/team/cto.jpg",
    bio: "Pioneering AI architect with extensive experience in developing enterprise-scale AI solutions.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "Emma Thompson",
    role: "Head of AI Research",
    image: "/team/research-head.jpg",
    bio: "PhD in Computer Science, leading breakthrough research in natural language processing and computer vision.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
  {
    name: "David Park",
    role: "Head of Engineering",
    image: "/team/engineering-head.jpg",
    bio: "Expert in scalable AI systems and cloud infrastructure, previously led engineering teams at AWS.",
    social: {
      linkedin: "#",
      twitter: "#",
      github: "#",
    },
  },
];

export function TeamSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Meet Our Leadership
          </h2>
          <p className="mt-4 text-gray-500 md:text-xl">
            Visionaries and experts shaping the future of AI
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-primary mt-1">{member.role}</p>
                <p className="mt-3 text-gray-500 text-sm">{member.bio}</p>
                <div className="mt-4 flex space-x-4">
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.github}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
