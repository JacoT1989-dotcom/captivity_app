import Link from "next/link";
import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 font-sans text-xs py-20 w-full mt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div className="mx-5">
          <h3 className="font-bold mb-4 text-white">FOLLOW US</h3>
          <ul>
            <li className="mb-2 flex items-center">
              <FaInstagram className="icons instagram text-white hover:text-gray-500" />
              <a
                href="https://www.instagram.com/fwrdheadwearapparelza/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 hover:text-red-600"
              >
                Instagram
              </a>
            </li>
            <li className="mb-2 flex items-center">
              <FaFacebook className="icons facebook text-white hover:text-gray-500" />
              <a
                href="https://www.facebook.com/CaptivityHeadwearApparel/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 hover:text-red-600"
              >
                Facebook
              </a>
            </li>
            <li className="mb-2 flex items-center">
              <FaYoutube className="icons youtube text-white hover:text-gray-500" />
              <a
                href="https://www.youtube.com/channel/UCCY1jcwbOK-DXEfmMI5a77Q"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 hover:text-red-600"
              >
                Youtube
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">INFORMATION</h3>
          <ul>
            <li className="mb-2 hover:text-red-600">
              <Link href="/about">About</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/Help">Help</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/contact">Contact Us</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/custom-orders">Custom Orders</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/info-act">Information Act</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/terms-conditions">Terms & Conditions</Link>
            </li>
            <li className="mb-2 hover:text-red-600">
              <Link href="/international-tolerances">
                International Tolerances on Apparel
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">CONTACT US</h3>
          <p>
            General:{" "}
            <a href="mailto:info@captivity.co.za" className="text-red-500">
              info@captivity.co.za
            </a>
          </p>
          <p>
            Website Queries:{" "}
            <a href="mailto:web@captivity.co.za" className="text-red-500">
              web@captivity.co.za
            </a>
          </p>
          <div className="mt-4">
            <p className="font-bold">CAPE TOWN:</p>
            <p>Tel: +27 21- 510 3868</p>
          </div>
          <div className="mt-4">
            <p className="font-bold">JOHANNESBURG:</p>
            <p>Tel: +27 11- 608 3014</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-white">OPENING HOURS</h3>
          <div className="mb-4">
            <p className="font-bold">CAPE TOWN:</p>
            <p>Mon – Thu: 8 am – 5 pm</p>
            <p>Friday: 8 am – 4 pm</p>
            <p>Saturday – Sunday: Closed</p>
            <p>Public Holidays: Closed</p>
          </div>
          <div>
            <p className="font-bold">JOHANNESBURG:</p>
            <p>Mon – Thu: 7 am – 5 pm</p>
            <p>Friday: 7 am – 4 pm</p>
            <p>Saturday – Sunday: Closed</p>
            <p>Public Holidays: Closed</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center mt-10">
        <Link href="https://captivity.co.za/contact/">
          <button className="bg-transparent border-2 border-slate-400 text-white hover:bg-red-700 hover:border-red-700 py-2 px-4">
            OUR OFFICES
          </button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
