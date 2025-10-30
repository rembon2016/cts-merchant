import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const GuideAccordion = ({ guides = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {guides.map((guide, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
        >
          {/* Accordion Header */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{guide.icon}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {guide.title}
              </span>
            </div>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Accordion Content */}
          {openIndex === index && (
            <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-700">
              {guide.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {guide.description}
                </p>
              )}
              
              {/* Steps */}
              <div className="space-y-3">
                {guide.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full Laporan text-white text-sm flex items-center justify-center font-medium">
                      {stepIndex + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Optional Image */}
              {guide.image && (
                <div className="mt-4">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GuideAccordion;
