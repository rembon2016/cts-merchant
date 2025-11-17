import { XCircle } from "lucide-react";

export const ElementsNoData = (props) => {
  const { text } = props;

  return (
    <div className="flex flex-col items-center justify-center text-gray-500 p-4 rounded-lg h-[250px]">
      <XCircle className="w-16 h-16 mb-2 text-gray-400" />
      <span className="text-sm">{text}</span>
    </div>
  );
};
