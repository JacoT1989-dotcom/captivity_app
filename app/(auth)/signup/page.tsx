import RegistrationHeader from "./RegistrationHeader";
import RegistrationForm from "./SignUpForm";

const Page = () => {
  return (
    <div className="container mx-auto p-6">
      <RegistrationHeader />
      <RegistrationForm />
    </div>
  );
};

export default Page;
