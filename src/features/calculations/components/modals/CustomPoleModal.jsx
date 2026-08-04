import { AlertCircle } from "lucide-react";

export const CustomPoleModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8">
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-blue-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
        </div>

        <h2 className="text-center font-bold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">
          Feature Not Yet Available
        </h2>

        <p className="text-center text-gray-600 text-xs sm:text-sm mb-5 sm:mb-8">
          The drawing feature for Custom Pole configurations is currently under development. We apologize for the inconvenience and appreciate your patience as we work to bring you this functionality soon.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 font-bold text-xs sm:text-sm bg-blue-500 text-white rounded-md sm:rounded-lg hover:bg-blue-600 transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
