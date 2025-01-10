"use client";

import React from "react";
import { useState } from "react";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 shadow-sm font-bold text-gray-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-4"
      >
        <span className="pr-2">{isOpen ? "▲" : "▶"}</span>
        {title}
      </button>
      {isOpen && <div className="pt-5 pb-8 px-8 font-normal">{children}</div>}
    </div>
  );
};

const TermsAndConditions = () => {
  return (
    <div>
      <div className="mx-auto p-10">
        <h1 className="text-center text-2xl text-red-600 font-bold top-10">
          TERMS & CONDITIONS
        </h1>
        <div>
          <h3 className="text-xl text-red-600 font-bold text-left mt-5">
            DEFINITIONS
          </h3>
          <p className="text-gray-500 mt-3">
            The person, firm or company buying is hereafter termed “The Buyer.
          </p>

          <h3 className="text-xl text-red-600 font-bold text-left mt-5">
            COMPANY POLICY
          </h3>
          <p className="text-gray-500 mt-3">
            Our BRAND is strictly distributed via authorised distributors
            namely: promotional companies, advertising and event companies as
            well as independent resellers only.
          </p>

          <div className="p-8">
            <Dropdown title="PRICES">
              <p>
                Prices are as per the current pricelist. Quoted prices are valid
                for 7 days. Unless otherwise stated, prices are exclusive of
                VAT. Due to the volatility of our currency CAPTIVITY reserves
                the right to change prices without prior notice.
              </p>
            </Dropdown>
            <Dropdown title="PAYMENT TERMS">
              <p>
                Strictly C.B.C (Cash Before Collection) – please note payments
                over the amount of <span className="font-bold">R1000</span> must
                be transferred electronically into our account unless otherwise
                discussed with management.
              </p>
              <p>
                <span className="font-bold underline">
                  Please use your Account Number
                </span>{" "}
                with us “found on the top left-hand side of your invoice ” –{" "}
                <span className="font-bold underline">
                  as a payment reference
                </span>{" "}
                on your online banking, to enable Bank Manager to allocate
                payments to the correct account.
              </p>
            </Dropdown>
            <Dropdown title="CLAIMS">
              <p>
                Claims in respect of faulty goods/short delivery shall not be
                grounds for withholding payment of account and shall not give
                the Buyer any right to set off the claim amount against payments
                due to the Seller. All claims must be lodged within seven days
                of date of collecting stock.
              </p>
            </Dropdown>
            <Dropdown title="SAMPLES">
              <p>
                Samples can be purchased individually and will be credited
                /exchanged within 10 working days, from date of collection
              </p>
              <p>
                Samples must be returned with a copy of the invoice, in original
                condition as well as original packaging.
              </p>
              <p>
                Should samples become damaged or dirty and not fit for resale,
                this will result in samples not being accepted for return.
              </p>
              <p>Samples returns are not subject to a handling fee.</p>
              <p>
                No Samples will be accepted back after the 10-working day
                period.
              </p>
              <p>
                Samples to the Value of <span className="font-bold">R50</span>{" "}
                or less will <span className="font-bold">NOT</span> be eligible
                for return.
              </p>
              <p className="font-bold underline">
                NO RETURNS WILL BE ACCEPTED ON BRANDED GOODS OR WHITE/ LIGHT
                COLOURED ITEMS
              </p>
            </Dropdown>
            <Dropdown title="SELLERS LIABILITY">
              <p>
                No guarantee is given to the suitability of goods sold for any
                particular purposes, this responsibility rests on the buyers
                choice.
              </p>

              <p>
                In no case will the Seller accept liability for deleterious
                effect resulting from the application of any process or
                treatment (whether advised by the Seller or not) to the goods
                after delivery. Should the Seller apply any process or treatment
                to the garments on behalf of the Buyer (or at the Buyers
                request) the above will also apply.
              </p>

              <p>
                It is the responsibility of the buyer to ensure all garments are
                acceptable (being style, size or colour) prior to branding them.
              </p>

              <p className="font-bold pt-3">Garment Manufacturer Defects</p>

              <p>
                CAPTIVITY is not responsible for garment manufacturer defects
                such as garment color inconsistencies, mislabeled sizes, loose
                stitching, holes, imperfect garment, or other garment defects.
              </p>
            </Dropdown>

            <Dropdown title="COLOUR VARIANCES">
              <p>
                We urge our clients to ensure they are aware and accepting of
                any shade variance that might occur in an order.
              </p>

              <p>
                We have made every effort to ensure that the information on our
                Products displayed at our facility, in our promotional material,
                on our website, or any other form of communication to you, is
                accurate.
              </p>

              <p>
                While we use our best endeavours to ensure that the image
                representing the Product, the features, descriptions and
                specifications pertaining to the Product are correct, the actual
                product may be subject to variations in appearance as the
                packaging may differ over time, or colour representation in
                marketing material may depend on the medium on which the image
                is displayed.
              </p>
            </Dropdown>

            <Dropdown title="GENERAL">
              <p>
                No variation of the condition of sale shall be effective unless
                agreed to by the Seller in writing.
              </p>
            </Dropdown>

            <Dropdown title="COLLECTIONS">
              <p>
                The parties agree that the Seller is not responsible for any
                damages or shortages due to the negligence or act of omission or
                commission to the part of a courier.
              </p>

              <p>
                Delivery will be deemed to have occurred and liability will pass
                to the Buyer when their appointed courier/driver collects the
                goods at the Sellers Depot.
              </p>

              <p>
                The Seller does not accept responsibility for claims against it
                for damages of whatsoever nature arising from non-delivery of
                goods on due date.
              </p>

              <p className="font-bold italic pt-3">
                *Any order not collected within 30 days of invoice date will be
                put back to stock and a credit issued to clients account. NO
                CASH REFUNDS will be permitted.*
              </p>
            </Dropdown>

            <Dropdown title="SUITABILITY">
              <p>
                No guarantee is given as to the suitability or quality of goods
                sold for any particular purpose and the Seller is here by
                absolved of any liability of whatsoever nature for any damages
                of whatsoever nature arising out of its direct failure or
                negligence in terms of this agreement or for any indirect
                damages to the Buyer.
              </p>

              <p className="py-3">
                It is imperative that CLIENTS check their invoices are correct
                and accurate before making payment as we are not able to assist
                on a same day basis with the following:
              </p>

              <ul className="font-bold pt-3 pb-5">
                <li>• NO EXCHANGES</li>
                <li>• NO SWAPS</li>
                <li>• NO CASH REFUNDS</li>
              </ul>

              <p>(A credit will be allocated to your account) </p>
            </Dropdown>

            <Dropdown title="RETURNS">
              <p>
                No returns after 10 working days working period from the date of
                collection.
              </p>
              <p>
                The Seller reserves the right to refuse to accept goods returned
                for credit.
              </p>
              <p>
                The Seller reserves the right to refuse to recognize any
                complaint from the Buyer in respect of shortages especially
                where the invoice has not been endorsed with the amount claimed
                as having been short delivered.
              </p>
              <p>
                No goods will be refunded / exchanged unless prior authorization
                and an authorization number has been obtained from your sales
                representative.
              </p>

              <p className="py-2">
                All returns are to be communicated in writing to your relevant
                sale administrator for approval stating:
              </p>

              <ul className="pb-2">
                <li>
                  – the relevant document number/style(s) to be returned/
                  reason.
                </li>
                <li>
                  – Items must be returned in their original condition &
                  packaging
                </li>
                <li>– Items must be accompanied by their invoice.</li>
                <li>
                  – The Buyer must return damaged goods to the Seller for
                  inspection, if the claim is accepted, goods will be replaced.
                </li>
              </ul>

              <p>
                Under special circumstances, the seller may agree to accept a
                return after the 10-working days period, in this case a handling
                fee of 20% (twenty) percent of the total value of the invoice
                will be charged.
              </p>

              <p>No Returns will be accepted after 30 days!</p>
            </Dropdown>

            <Dropdown title="NO CREDIT/DEBIT CARD FACILITIES">
              <p>
                There are no credit/debit card facilities at any of our
                branches.
              </p>
            </Dropdown>

            <Dropdown title="CASH PAYMENTS">
              <p>
                Due to the high costs of cash deposits, we can only allow
                payments of R1000 per transaction/invoice.
              </p>
            </Dropdown>

            <Dropdown title="ORDER COLLECTION">
              <p>
                Kindly be advised that you may collect your order only 24 – 48
                hours after we have received proof of payment.
              </p>
              <p>
                Please ensure proof of payment is emailed to the relevant sales
                agent, to avoid delays.
              </p>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
