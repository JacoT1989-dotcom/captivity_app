"use client";

import { useState } from "react";
import { SlArrowDown } from "react-icons/sl";
import { FaRegWindowMinimize } from "react-icons/fa";
import Link from "next/link";
import Modal from "./help-modal";

type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11"
  | "q12"
  | "q13"
  | "q14"
  | "q15"
  | "q16"
  | "q17";

const Questions = () => {
  const [openQuestion, setOpenQuestion] = useState<QuestionId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  const toggleContent = (question: QuestionId): void => {
    setOpenQuestion(openQuestion === question ? null : question);
  };

  return (
    <div className="max-w-[840px] mx-auto mt-3 mb-10 p-5 text-gray-700 bg-gray-100 rounded">
      <h1 className="text-2xl text-gray-500 font-semibold text-center pb-4 mt-6 mb-6">
        What can we help you with?
      </h1>
      <span className="max-w-2xl mx-auto text-center justify-start">
        {" "}
        <h2 className="text-lg text-gray-500 font-bold mb-2">
          Popular Questions
        </h2>
      </span>

      <div className="">
        <div>
          <div className=" border-gray-300">
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q1")}
                className="w-full text-left flex justify-between items-center"
              >
                Do you guys sell directly to the public?
                <span className="text-gray-500 font-bold">
                  {openQuestion === "q1" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q1" && (
                <div id="q1" className="bg-gray-200 p-4 rounded mt-2">
                  Regrettably, we do not supply directly to the public nor the
                  end-user.
                  <br />
                  <br />
                  <Link
                    href="mailto:info@captivity.co.za [undefined:info@captivity.co.za]"
                    className="text-red-500 font-bold hover:text-red-600"
                  >
                    Get a referral
                  </Link>
                  .
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q2")}
                className="w-full text-left flex justify-between items-center"
              >
                Where can I find the prices of your products?
                <span className="text-gray-500">
                  {openQuestion === "q2" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q2" && (
                <div id="q2" className="bg-gray-200 p-4 rounded mt-2">
                  Only registered resellers that are on our database will be
                  able to view stock availability & pricing.
                  <br />
                  <br />
                  Complete the{" "}
                  <Link
                    href="/register"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    registration form
                  </Link>
                  .
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q3")}
                className="w-full text-left flex justify-between items-center"
              >
                Do you offer any branding?
                <span className="text-gray-500">
                  {openQuestion === "q3" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q3" && (
                <div id="q3" className="bg-gray-200 p-4 rounded mt-2">
                  We do not offer branding as a service on our products. Our
                  policy is to support all local embroiderers & printers. We
                  would be happy to refer you for this service.
                  <br />
                  <br />
                  <Link
                    href="mailto:info@captivity.co.za [undefined:info@captivity.co.za]"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    Get a referral
                  </Link>
                  .
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q4")}
                className="w-full text-left flex justify-between items-center"
              >
                Do you have a delivery service?
                <span className="text-gray-500">
                  {openQuestion === "q4" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q4" && (
                <div id="q4" className="bg-gray-200 p-4 rounded mt-2">
                  We do not offer a delivery or courier service. Clients are to
                  kindly organize this on their part. .
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q5")}
                className="w-full text-left flex justify-between items-center"
              >
                Where can I buy your products if I’m not a reseller?
                <span className="text-gray-500">
                  {openQuestion === "q5" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q5" && (
                <div id="q5" className="bg-gray-200 p-4 rounded mt-2">
                  You can email{" "}
                  <Link
                    href="mailto:info@captivity.co.za"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    info@captivity.co.za
                  </Link>{" "}
                  to be referred to resellers in your area.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
          </div>
          <span className="max-w-2xl mx-auto text-center justify-start">
            {" "}
            <h2 className="text-lg text-gray-500 mt-4 font-bold mb-2">
              Register & Data
            </h2>
          </span>
          <div className=" border-gray-300">
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q6")}
                className="w-full text-left flex justify-between items-center"
              >
                How can I become a reseller of your products?
                <span className="text-gray-500">
                  {openQuestion === "q6" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q6" && (
                <div id="q6" className="bg-gray-200 p-4 rounded mt-2">
                  The FWRD brand is strictly distributed via authorised
                  distributors namely: promotional companies, advertising and
                  event companies as well as independent resellers. Should you
                  fall into either of these categories, you are welcome to
                  register with us.
                  <br />
                  <br />
                  Completed the{" "}
                  <Link
                    href="/register"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    registration form.
                  </Link>
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q7")}
                className="w-full text-left flex justify-between items-center"
              >
                How long does the registration process take?
                <span className="text-gray-500">
                  {openQuestion === "q7" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q7" && (
                <div id="q7" className="bg-gray-200 p-4 rounded mt-2 ">
                  Once you have completed the{" "}
                  <Link
                    href="/register"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    registration form.
                  </Link>{" "}
                  we will go through it to make sure you are a reseller. You
                  will received an email once your account has been approved.
                  The process usually takes 1 working day.
                  <br />
                  <br />
                  The process usually takes 1 working day.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q8")}
                className="w-full text-left flex justify-between items-center"
              >
                How do I change my password?
                <span className="text-gray-500">
                  {openQuestion === "q8" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q8" && (
                <div id="q8" className="bg-gray-200 p-4 rounded mt-2">
                  On the top of any captivity.co.za page, go to{" "}
                  <Link
                    href="https://dev.captivity.co.za/staging/my-account/"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    My Account
                  </Link>{" "}
                  and click on the{" "}
                  <Link
                    href="https://dev.captivity.co.za/staging/my-account/edit-account/"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    Account Info button
                  </Link>
                  , then simply complete the <b>Password Change</b> fields and
                  click <b>Save Changes</b>.
                  <br />
                  <br />
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q9")}
                className="w-full text-left flex justify-between items-center"
              >
                I have forgotten my password / email, how do I access my
                account?
                <span className="text-gray-500">
                  {openQuestion === "q9" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q9" && (
                <div id="q9" className="bg-gray-200 p-4 rounded mt-2">
                  Don’t worry, we’ll help you create a new one. On our log-in
                  page, click on the bottom link{" "}
                  <Link
                    href="https://dev.captivity.co.za/staging/my-account/lost-password/"
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    “Lost your password?“
                  </Link>
                  .<br /> Enter your account email or username and we’ll then
                  email you instructions on how to create a new password.
                  <br />
                  <br /> If you forgot the email you where using or want to use
                  a new email to sign in, then please send us an email{" "}
                  <Link
                    className="text-red-500 hover:text-red-700 font-bold"
                    href="mailto:design@captivity.co.za"
                  >
                    here
                  </Link>{" "}
                  where we will help you reset your account with your new email
                  address.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q10")}
                className="w-full text-left flex justify-between items-center"
              >
                How do I unsubscribe from your email newsletters?
                <span className="text-gray-500">
                  {openQuestion === "q10" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q10" && (
                <div id="q10" className="bg-gray-200 p-4 rounded mt-2">
                  If you don’t want to receive any newsletters you can click on
                  the
                  <br />{" "}
                  <Link
                    href="https://dev.captivity.co.za/staging/?nltr=MTA7OTIyO2h0dHBzOi8vY2FwdGl2aXR5LmNvLnphLz9uYT11Jm5rPTkyMi03ZjEyOGIyNWQ5Jm5laz0xMC07OzUzNTM1ODJiZTExYjBmZjk4NTEyYmZlMWJiNDViMTNk"
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    Unsubscribe
                  </Link>{" "}
                  link at the bottom of the emailer that you have received from{" "}
                  <br /> us.
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className=" border-gray-300">
            <span className="max-w-2xl mx-auto text-center justify-start">
              {" "}
              <h2 className="text-lg text-gray-500 mt-4 font-bold mb-2">
                Orders
              </h2>
            </span>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q11")}
                className="w-full text-left flex justify-between items-center"
              >
                How do I place an order?
                <span className="text-gray-500">
                  {openQuestion === "q11" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q11" && (
                <div id="q11" className="bg-gray-200 p-4 rounded mt-2">
                  Find the products you wish to buy on the website, add them to
                  cart. You can go back and keep searching and adding to your
                  cart.
                  <br />
                  <br /> Click on <b>Proceed to Checkout</b>. If you are happy
                  with the order click on
                  <br /> <b>Place Order</b>.
                  <br /> <br /> Alternatively email your preferred sales agent
                  your order, on receipt, she
                  <br /> will email you an invoice – payment is to be made on
                  receipt, as stock is
                  <br /> not held.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q12")}
                className="w-full text-left flex justify-between items-center"
              >
                When will my order be ready?
                <span className="text-gray-500">
                  {openQuestion === "q12" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q12" && (
                <div id="q12" className="bg-gray-200 p-4 rounded mt-2">
                  Your order will be ready 24/48 hours after payment is made.
                  <br />
                  Kindly ensure you email your payment to the sales agent that
                  assisted
                  <br /> you with your order. <br />
                  Your payment reference must please be your{" "}
                  <b>Account Number</b> on your <br /> invoice and name.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q13")}
                className="w-full text-left flex justify-between items-center"
              >
                What is the minimum order policy?
                <span className="text-gray-500">
                  {openQuestion === "q13" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q13" && (
                <div id="q13" className="bg-gray-200 p-4 rounded mt-2">
                  Great News!!! We do not have a Minimum Order Quantity as stock
                  is readily available for our warehouses.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className=" border-gray-300">
            <span className="max-w-2xl mx-auto text-center justify-start">
              {" "}
              <h2 className="text-lg text-gray-500 mt-4 font-bold mb-2">
                Payments
              </h2>
            </span>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q14")}
                className="w-full text-left flex justify-between items-center"
              >
                How can I pay for my order?
                <span className="text-gray-500">
                  {openQuestion === "q14" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q14" && (
                <div id="q14" className="bg-gray-200 p-4 rounded mt-2">
                  At the bottom of your invoice, you will find all FOUR major
                  banks we bank
                  <br /> with.
                  <br /> Kindly use the same bank you are with, to enable us to
                  allocate your payment
                  <br /> swiftly.
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q15")}
                className="w-full text-left flex justify-between items-center"
              >
                Can I pay with my Debit / Credit Card?
                <span className="text-gray-500">
                  {openQuestion === "q15" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q15" && (
                <div id="q15" className="bg-gray-200 p-4 rounded mt-2">
                  None of our branches has Credit Card facilities. kindly make
                  an EFT for your
                  <br /> order.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className=" border-gray-300">
            <span className="max-w-2xl mx-auto text-center justify-start">
              {" "}
              <h2 className="text-lg text-gray-500 mt-4 font-bold mb-2">
                Returns
              </h2>
            </span>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q16")}
                className="w-full text-left flex justify-between items-center"
              >
                What is your returns policy?
                <span className="text-gray-500">
                  {openQuestion === "q16" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q16" && (
                <div id="q16" className="bg-gray-200 p-4 rounded mt-2">
                  No returns accepted after a <b>10 day working period</b> from
                  the date of invoice
                  <br /> issued.
                  <br /> All returns are to be communicated in writing to your
                  relevant sales
                  <br /> administrator for approval, stating the relevant
                  document number and
                  <br /> style(s) to be returned and the reason for return.
                  <br /> No goods will be credited / exchanged unless prior
                  authorization and an
                  <br /> authorization number have been obtained from your sales
                  representative.
                  <br />
                  Items must be returned in their original packaging.
                  <br />
                  <br /> <b>NO RETURNS</b>
                  will be accepted on white/light colored or branded items.
                  <br />
                  <br /> The Seller reserves the right to refuse to accept goods
                  returned for credit.
                  <br /> The Seller reserves the right to refuse to recognize
                  any complaint from the
                  <br /> Buyer in respect of shortages especially where the
                  invoice has not been
                  <br /> endorsed with the amount claimed as having been short
                  delivered.
                  <br />
                  <br /> Samples to the Value of R30 or less will not be
                  eligible for return.
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 max-w-2xl mx-auto bg-white p-2 border-b-2  shadow-md">
              <button
                onClick={() => toggleContent("q17")}
                className="w-full text-left flex justify-between items-center"
              >
                Can I exchange my product?
                <span className="text-gray-500">
                  {openQuestion === "q17" ? (
                    <FaRegWindowMinimize />
                  ) : (
                    <SlArrowDown />
                  )}
                </span>
              </button>
              {openQuestion === "q17" && (
                <div id="q17" className="bg-gray-200 p-4 rounded mt-2">
                  You can exchange your product, provided it is within the{" "}
                  <b>
                    7 day return
                    <br /> period.
                  </b>
                  <br />
                  Kindly note, exchanges will not be possible on the same day.
                  <br />
                  <br />
                  It needs to be returned, checked and credited. The client can
                  then replace the product
                  <br />
                  <br />
                  <span className="flex text-center justify-center">
                    Didn’t find what you need?
                  </span>{" "}
                  <span className="flex text-center justify-center">
                    {" "}
                    <button
                      onClick={openModal}
                      className="border-red-500  border-2 text-gray-500 bg-white px-4 py-2 rounded mt-2"
                    >
                      Contact Us
                    </button>
                    <Modal isOpen={isModalOpen} onClose={closeModal} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
