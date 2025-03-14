import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { InputJson } from "./components/InputJson";
import "@xyflow/react/dist/style.css";

interface CustomNodeProps {
  data: {
    label: string;
  };
}

const CustomNode = ({ data }: CustomNodeProps) => {
  console.log("🚀 ~ CustomNode ~ data:", data);
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
      {data.label}
    </div>
  );
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const fetchData = async (dataInput: object) => {
    const res = await fetch("http://localhost:5000/api/visualize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataInput),
    });
    const data = await res.json();
    return data;
  };

  const nodeTypes = { CustomNode };

  const handleSetNodesAndEdges = async (dataObject: object) => {
    const response = await fetchData(dataObject);
    const {newNodes, newEdges} = response;
    const modifyNodes = newNodes.map((node: any) => {
      let { style, ...rest } = node;
      
      rest.data.label = rest.data.label.replace(/^root=/, "").replace(/.*=([^=]+)$/, "$1")
      delete style.width
      style["width"] = "auto"

      return {
        ...rest,
        style,
      };
    });
    setNodes(modifyNodes);
    setEdges(newEdges);
  };


  return (
    <div className="container-fluid">
      <div className="flex flex-col md:flex-row">
        <InputJson
          handleSetNodesAndEdges={handleSetNodesAndEdges}
        />
        <div className="w-full p-4 calc-height md:h-screen">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
