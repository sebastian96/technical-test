import { useState } from "react";

interface InputJsonProps {
  handleSetNodesAndEdges: (dataObject: object) => void;
}
export const InputJson: React.FC<InputJsonProps> = ({
  handleSetNodesAndEdges,
}) => {
  const [jsonError, setJsonError] = useState<boolean>(false);
  const [jsonValue, setJsonValue] = useState<string>("");

  const INVALID_JSON_MESSAGE = "Invalid JSON - please try again";

  const isJsonInvalid = (json: string) => {
    try {
      if (json === "") {
        return false;
      }
      const parsed = JSON.parse(json);
      if (typeof parsed !== "object") {
        throw new Error("Invalid JSON");
      }
      return false;
    } catch (error) {
      return true;
    }
  };

  const handleJsonChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const hasError = isJsonInvalid(e.target.value);
    setJsonValue(e.target.value);
    setJsonError(hasError);
  };

  const validateAndProcessJson = async () => {
    if (!jsonError) {
      handleSetNodesAndEdges(JSON.parse(jsonValue))
    }
  };

  return (
    <div className="w-full md:w-1/4 h-52 md:h-screen flex flex-wrap gap-2 bg-gray-800 p-4">
      <textarea
        className={`w-full h-auto md:h-5/6 p-2 bg-gray-700 rounded resize-none hide-scrollbar focus:outline-none ${
          jsonError ? "text-red-500" + " border-2 border-red-500" : "text-white"
        }`}
        placeholder="Enter JSON here"
        onChange={handleJsonChange}
      ></textarea>
      {jsonError && (
        <p className="block w-full md:w-auto text-red-500 text-lg mt-2">
          {INVALID_JSON_MESSAGE}
        </p>
      )}
      <button
        onClick={() => validateAndProcessJson()}
        className={`mt-4 max-h-10 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
          jsonError
            ? "bg-red-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
        disabled={jsonError}
      >
        Check JSON
      </button>
    </div>
  );
};
