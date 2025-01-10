import React from "react";
import FollowUs from "./_footer-comp/FollowUs";
import Information from "./_footer-comp/Information";
import ContactUs from "./_footer-comp/ContactUs";
import OpeningHours from "./_footer-comp/OpeningHours";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-sans text-xs py-20 w-full">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <Information />
        <OpeningHours />
        <ContactUs />
        <FollowUs />
      </div>
    </footer>
  );
};

export default Footer;
