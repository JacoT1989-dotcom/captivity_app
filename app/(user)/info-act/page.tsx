import React from "react";
import styles from "./info-act.module.css";

const InfoAct = () => {
  return (
    <div className={styles.infoActContainer}>
      <h1 className={`${styles.infoActTitle} text-4xl font-bold mt-2 mb-6`}>
        INFORMATION ACT
      </h1>
      <br />
      <section className={`${styles.infoActSection}`}>
        <p>
          <strong className="font-semibold text-gray-500">DISCLAIMER</strong>
        </p>
        <p className="text-gray-500 mt-6">
          Whilst every effort is made to ensure accuracy of colours on this
          website, they should be used as a guide only.
        </p>
        <p className="text-gray-500 mt-6 mb-6">
          Logos and trademarks displayed on products on this website are for the
          purpose of showing our capabilities. These designs are not necessarily
          available for sale unless expressly authorized by the owner of such
          designs.
        </p>
        <p className="text-gray-500 mt-6 mb-6">
          To date all information is correct. As we continue to improve our
          range, changes may be made without prior notice.
        </p>
        <p>
          <strong className="font-semibold text-gray-500">CONTENTS</strong>
        </p>
        <p className="text-gray-500 mt-6 mb-6">A.Introduction</p>
        <p className="text-gray-500 mt-6 mb-6">
          B. Particulars in terms of section 51 of the Promotion of Access to
          information Act
        </p>
        <div className="text-gray-500 mt-6 px-6">
          <ul className="list-disc pl-5">
            <li>Contact details</li>
            <li>The section 10 Guide on how to use the Act</li>
            <li>Records available in terms of any other legislation</li>
            <li>
              Access to the records held by the private body in question–
              Information readily available, if applicable
              <ul className="list-none">
                <li>– Records that may be requested</li>
                <li>– The request procedures</li>
              </ul>
            </li>
            <li>Other information as may be prescribed</li>
            <li>Availability of the manual</li>
          </ul>
        </div>
        <br />
        <p>
          <strong className="font-semibold text-gray-500">
            A. INTRODUCTION
          </strong>
        </p>
        <p className="text-gray-500 mt-6">Main Business</p>
        <p className="text-gray-500 mt-6">
          Importation and distribution of headwear and associated products.
        </p>
        <br />
        <p>
          <strong className="font-semibold text-gray-500">
            B. PARTICULARS IN TERMS OF THE SECTION 51 MANUAL
          </strong>
        </p>
        <p className="text-gray-500 mt-6 mb-6">
          <strong>1. Contact details</strong>
        </p>
        <div className="text-gray-500">
          <p>Head of the body: Mr C Parrello</p>
          <br />
          <p>Postal address:</p>
          <p>PO Box 210</p>
          <p>Maitland</p>
          <p>7405</p>
          <br />

          <p>Street Address:</p>
          <p>410 Voortrekker Road</p>
          <p>Maitland</p>
          <p>7405</p>
          <br />

          <p>Telephone number: (021) 510 3868</p>
          <p>Fax number: (021) 510 5182</p>
          <p>
            {/*Email address: <a href="mailto:info@captivity.co.za">*/}
            {/* re-use when Email Activates */}
            Email address:{" "}
            <a href="https://captivity.co.za/contact/">
              <span className="text-red-600">info@captivity.co.za</span>
            </a>
          </p>
        </div>
        <br />

        <p className="font-semibold text-gray-500">
          <strong>2. The section 10 Guide on how to use the Act</strong>
        </p>
        <br />
        <div className="text-gray-500 mt-3">
          <p>
            The Guide will, according to the South African Human Rights
            Commission (SAHRC), be available for inspection at the offices of
            the SAHRC. Please direct any queries to:
          </p>
          <br />

          <p>The South African Human Rights Commission:</p>
          <br />

          <p>PAIA Unit</p>
          <p>The Research and Documentation Department</p>
          <p>Postal address: Private Bag 2700</p>
          <p>Houghton</p>
          <p>2041</p>
          <br />

          <p>Telephone: +27 +11 – 484-8300</p>
          <p>Fax: +27 +11 – 484-7146</p>
          <p>
            Website:{" "}
            <a href="http://www.sahrc.org.za/">
              <span className="text-red-600">www.sahrc.org.za</span>
            </a>
          </p>
          <p>
            E-mail:{" "}
            <a href="mailto:PAIA@sahrc.org.za">
              <span className="text-red-600">PAIA@sahrc.org.za</span>
            </a>
          </p>
        </div>
        <br />

        <p className="font-semibold text-gray-500">
          <strong>
            {" "}
            3. Records available in terms of any other legislation
          </strong>
        </p>
        <br />
        <p className="text-gray-500">
          i. Basic Conditions of Employment No. 75 of 1997 ii. Close
          Corporations Act No. 69 of 1984 iii. Labour Relations Act No. 66 of
          1995 iv. Regional Services Councils Act No. 109 of 1985 v. Skills
          Development Levies Act No. 9 of 1999 vi. Skills Development Act No. 97
          of 1998 vii. Unemployment Contributions Act No. 4 of 2002 viii.
          Unemployment Insurance Act No. 63 of 2001 ix. Value Added Tax Act No.
          89 of 1991
        </p>
        <br />

        <p className="font-semibold text-gray-500">
          <strong> 4. Access to the records held by Captivity Headwear</strong>
        </p>
        <br />
        <p className="font-semibold text-gray-500">
          <strong> i. Information readily available</strong>
        </p>
        <p className="text-gray-500 mt-6">Not Applicable</p>
        <br />

        <p className="font-semibold text-gray-500">
          <strong> ii. Records that may be requested:</strong>
        </p>
        <br />
        <div className="text-gray-500">
          <p>Finances</p>
          <p>*Banking details</p>
          <p>Incorporation Documents</p>
          <p>*Incorporation forms</p>
        </div>
        <br />
        <p className="font-semibold text-gray-500">
          <strong> iii. The request procedures:</strong>
        </p>
        <br />
        <div className="text-gray-500">
          <p>Form of request:</p>
          <br />

          <p>
            * The requester must use the prescribed form to make the request for
            access to a record. This must be made to the head of the private
            body. This request must be made to the address, fax number or
            electronic mail address of the body concerned.
          </p>
          <p>
            * The requester must provide sufficient detail on the request form
            to enable the head of the private body to identify the record and
            the requester. The requester should also indicate which form of
            access is required. The requester should also indicate if any other
            manner is to be used to inform the requester and state the necessary
            particulars to be so informed.
          </p>
          <p>
            * The requester must identify the right that is sought to be
            exercised or to be protected and provide an explanation of why the
            requested record is required for the exercise or protection of that
            right.
          </p>
          <p>
            * If a request is made on behalf of another person, the requester
            must then submit proof of the capacity in which the requester is
            making the request to the satisfaction of the head of the private
            body.
          </p>
          <br />
          <p>Fees:</p>
          <br />
          <p>
            A requester who seeks access to a record containing personal
            information about that requester is not required to pay the request
            fee. Every other requester, who is not a personal requester, must
            pay the required request fee:
          </p>
          <br />
          <p>
            *The head of the private body must notify the requester (other than
            a personal requester) by notice, requiring the requester to pay the
            prescribed fee (if any) before further processing the request.
          </p>
          <p>
            *The fee that the requester must pay to a private body is R50. The
            requester may lodge an application to the court against the tender
            or payment of the request fee.
          </p>
          <p>
            * After the head of the private body has made a decision on the
            request, the requester must be notified in the required form.
          </p>
          <p>
            *If the request is granted then a further access fee must be paid
            for the search, reproduction, preparation and for any time that has
            exceeded the prescribed hours to search and prepare the record for
            disclosure.
          </p>
        </div>
        <br />
        <p className="font-semibold text-gray-500">
          <strong> 5. Other information as may be prescribed</strong>
        </p>
        <p className="text-gray-500 mt-6">
          The Minister of Justice and Constitutional Development has not made
          any regulations in this regard.
        </p>
        <br />
        <p className="font-semibold text-gray-500">
          <strong> 6. Availability of the manual</strong>
        </p>
        <br />
        <p className="text-gray-500 mb-16">
          The manual is also available for inspection during office hours at the
          offices of Captivity Headwear free of charge. Copies are available
          from the SAHRC and on our website.
        </p>
      </section>
    </div>
  );
};

export default InfoAct;
