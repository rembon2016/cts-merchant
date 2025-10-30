import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmailSupportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Email Support</h1>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400">Coming soon in Phase 2</p>
      </div>
    </div>
  );
};

export default EmailSupportPage;
