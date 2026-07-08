import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { HeaderCalculationPage } from "../components/layout/HeaderCalculationPage";
import { PenTool } from "lucide-react";

export default function DrawingInputPage() {
  const { type: projectType } = useParams();

  return (
    <>
      <div className="flex flex-col h-full">
        <Helmet>
          <title>Drawing Configuration - KORI BALI</title>
        </Helmet>

        <div className="flex-1 rounded-t-2xl hp:rounded-t-xl bg-gray-50 border border-gray-250 flex flex-col">
          <HeaderCalculationPage />

          <div className="mx-6 2040:mx-[250px] pt-12 pb-8 hp:mx-2 flex-1 flex flex-col items-center justify-center">
            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Drawing Configuration</h2>
              <p className="text-sm text-gray-500 mb-6">
                This page is currently under construction. Future drawing features will be available here.
              </p>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                Project Type: <span className="uppercase">{projectType}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
