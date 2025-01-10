import React from "react";
import styles from "./About.module.css";
import Image from "next/image";

const About = () => {
  return (
    <div>
      <div className={styles.aboutImageContainer}>
        <Image
          src="/About.jpg"
          alt="Headwear Collection"
          className={styles.aboutImage}
          priority
        />
        <div className={styles.headingOverlay}>
          <span className={styles.headwear}>HEADWEAR</span>
          <span className={styles.collection}>COLLECTION</span>
        </div>
      </div>
      <div className={styles.container}>
        <h1 className={styles.centeredHeading}>About</h1>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          We push brands forward with forward-thinking products!
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          Established in 1997, Captivity’s head office is located within
          cosmopolitan Cape Town and has since branched out to bustling
          Johannesburg, providing quality promotional headwear and apparel to
          Africa.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          Captivity are importers and suppliers of headwear & apparel crafted to
          the highest quality by the finest workmanship. As a company, we pride
          ourselves on the superior service and dedication we provide our loyal
          customers. This service excellence secures our position at the
          forefront of the ever-changing demands of the promotional industry.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          As a proudly South African company, we are elated to have a network of
          provincial distributors who enable us to supply to all our
          neighbouring African countries. This pride has fuelled our renowned
          hard work and commitment to remaining South Africa’s leading supplier
          of headwear and apparel.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          Boasting the largest selection of styles and colours in headwear, we
          continuously introduce new variations to our ranges as keeping
          on-trend with international fashions to satisfy any promotional
          requirement you may have. This is at the core of our high-quality
          service.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          Our apparel collection features a wide variety of quality garments
          that are constantly improved upon with our dedication to authentic
          product development. As an established trend-conscious company, we
          offer garments that elevate and empower brands to push their image
          forward.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          We believe in the power of supporting and empowering local businesses,
          that is why we support South Africa’s local branding companies and
          strive to provide high-quality products and service to all our
          resellers.
        </p>
        <p className={`${styles.paragraph} ${styles.paragraphMediumSpacing}`}>
          Captivity is a TRADE ONLY supplier of headwear and apparel dealing
          with the promotional, marketing, printing, and protective clothing
          sectors.
        </p>
      </div>
    </div>
  );
};

export default About;
