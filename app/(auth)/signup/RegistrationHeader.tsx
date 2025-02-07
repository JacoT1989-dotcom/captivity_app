const RegistrationHeader = () => {
  return (
    <>
      <div className="bg-gray-800 text-white p-4 mb-6">
        <h1 className="text-xl font-bold text-center">REGISTRATION FORM</h1>
      </div>

      <div className="mb-6">
        <h2 className="font-large font-bold text-1xl">
          Our Brand is strictly distributed via authorized distributors namely:
        </h2>
        <ul className="list-disc pl-8 mt-2">
          <li>Advertising Companies</li>
          <li>Branders and Event Companies</li>
          <li>Independent resellers</li>
        </ul>
        <p className="mt-2">
          Fill in the registration below form should you fall in one of these
          categories.
        </p>
      </div>

      <div className="bg-gray-100 p-4 mb-6">
        <p className="font-medium mb-2">
          Please enter your CAPTIVITY Account #
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Existing customers of Captivity can enter their Account Number and the
          required information below to have their web account automatically
          approved. If you do not know your account number, please contact your
          customer service representative via call or email, and they will
          provide it to you.
        </p>
      </div>
    </>
  );
};

export default RegistrationHeader;
