import { ReportView } from "../components/layouts/ReportView";
import { Helmet } from "react-helmet";

export default function ReportPage() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Helmet>
          <title>Report - KORI BALI</title>
          <meta
            name="report"
            content="CV. KORI BALI Report System provides comprehensive structural analysis and summary data for poles."
          />
        </Helmet>

        <div className="border border-gray-250">
          <ReportView />
        </div>
      </div>
    </>
  );
}
