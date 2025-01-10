"use client";
import Image from "next/image";
import Link from "next/link";
import FlipSection from "../../FlipImage/FlipSection";

const HowToRegister = () => {
  return (
    <div>
      <section className="bg-black text-center text-white py-16">
        <h1 className="md:text-2xl text-xl font-bold">HOW TO REGISTER?</h1>
        <p className="pt-7 mx-10 md:text-md text-sm">
          Captivity is strictly distributed via authorised distributors namely:
          promotional companies, advertising and event companies as well as
          independent resellers.
        </p>

        <p className="mx-10 md:text-md text-sm">
          We have a large offering of headwear and apparel and are distributors
          of a large selection of promotional items.
        </p>

        <p className="pb-4 mx-10 md:text-md text-sm">
          Should you fall into either of these categories and would like to
          register as a vendor?
        </p>
        <Link href="/signup">
          <button className="mt-6 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
            Register Here
          </button>
        </Link>
      </section>
      <FlipSection />
    </div>
  );
};

export default HowToRegister;
