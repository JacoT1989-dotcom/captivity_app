import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, FileImage } from "lucide-react";
import BackToCustomerPage from "../_components/BackToCustomerButton";
import Header from "../_components/Header";

const SelectImageFormatField = () => {
  const imageLinks = [
    {
      title: "JPEG Images",
      href: "https://drive.google.com/drive/folders/11qn10Hvw3s3-P-GPoZLb4wDTjhAcz7j4",
      icon: Image,
      description: "Browse our collection of high-quality JPEG images",
    },
    {
      title: "PNG Images",
      href: "https://drive.google.com/drive/folders/1i-VzsQagXO8hL4XfmvIxi5lWoMMzaiNz",
      icon: FileImage,
      description: "Access our transparent PNG image collection",
    },
  ];

  return (
    <section className="p-8 max-w-4xl mx-auto">
      <Header />
      <CardHeader className="px-0">
        <CardTitle className="text-3xl font-bold tracking-tight">
          <div className="flex justify-between  items-center">
            <span className="text-red-500">Product Images</span>
            <span className="hover:bg-neutral-100 p-2">
              <BackToCustomerPage />
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {imageLinks.map(link => (
          <Card
            key={link.title}
            className="group hover:shadow-lg transition-all duration-300 border-2 border-dashed"
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <link.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{link.title}</h3>
                <p className="text-muted-foreground">{link.description}</p>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="destructive" className="w-full mt-4">
                    View Collection
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SelectImageFormatField;
