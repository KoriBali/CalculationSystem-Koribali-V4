import { Helmet } from "react-helmet";
import CalculationSetupForm from "../components/forms/initial-setup/CalculationInit";

export default function CalculationSetupPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Calculation Setup - KORI BALI</title>
          <meta
            name="calculation"
            content="Calculation System CV. KORI BALI membantu Anda menghitung dan menganalisis struktur pole dengan mudah."
          />
        </Helmet>

        <div className="min-h-screen bg-gray-50 border border-gray-250">
          <CalculationSetupForm />
        </div>
      </div>
    </>
  );
}
