import React from "react";
import { Store, Building2, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export function RegisterSection() {
  const categories = [
    {
      icon: Store,
      title: "Retail Stores",
      description: "Physical stores selling clothing and accessories",
    },
    {
      icon: Building2,
      title: "Promotional Companies",
      description: "Businesses looking for branded merchandise solutions",
    },
    {
      icon: Users,
      title: "Independent Resellers",
      description: "Individual distributors and sales representatives",
    },
  ];

  return (
    <>
      <section className="py-16">
        <div className="container w-full mx-auto px-4">
          <div className="mx-auto bg-accent rounded-xl overflow-hidden">
            <div className="p-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">WHO CAN REGISTER</h2>
                <p className="text-muted-foreground text-lg">
                  Join our network of authorized distributors and grow your
                  business with Captivity if you fall under the following
                  categories:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-background rounded-lg p-6 text-center group hover:shadow-lg transition-all"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive mb-4 group-hover:scale-110 transition-transform">
                      <category.icon className="w-8 h-8 text-destructive-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-destructive hover:bg-destructive/90 transition-colors px-8 py-4 rounded-lg text-lg font-semibold text-destructive-foreground"
                >
                  Register Today
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="mt-4 text-muted-foreground">
                  Start your journey with Captivity today
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4">
        <div className="h-px bg-border"></div>
      </div>
    </>
  );
}
