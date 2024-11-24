import { Edge } from 'reactflow';

// calculateTreeLayout.ts
export const calculateTreeLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any,
  parentId: string | null = null,
  currentId = 'root',
  depth = 0,
  xOffset = 0
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newNodes: any[] = [];
  const newEdges: Edge[] = [];

  const ySpacing = 150;
  const xSpacing = 200;

  const getLabel = (id: string): string => {
    return id.split('=').pop() || id;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSubtreeWidth = (node: any): number => {
    if (typeof node !== 'object' || node === null) {
      return 1;
    }
    if (Array.isArray(node)) {
      return node.reduce((width, item) => width + getSubtreeWidth(item), 0);
    }
    return Object.keys(node).reduce((width, key) => width + getSubtreeWidth(node[key]), 0);
  };

  const subtreeWidth = getSubtreeWidth(json) * xSpacing;
  const nodeX = xOffset + subtreeWidth / 2 - xSpacing / 2;
  const nodeY = depth * ySpacing;

  newNodes.push({
    id: currentId,
    data: { label: parentId === null ? 'Root' : getLabel(currentId) },
    position: { x: nodeX, y: nodeY },
    style: { width: 100, padding: '10px', textAlign: 'center' },
  });

  if (parentId) {
    newEdges.push({
      id: `e-${parentId}-${currentId}`,
      source: parentId,
      target: currentId,
    });
  }

  if (Array.isArray(json)) {
    let childOffset = xOffset;

    json.forEach((item, index) => {
      const childId = `${currentId}[${index}]`;
      const childSubtreeWidth = getSubtreeWidth(item) * xSpacing;
      const childGraph = calculateTreeLayout(item, currentId, childId, depth + 1, childOffset);

      childOffset += childSubtreeWidth;

      newNodes.push(...childGraph.newNodes);
      newEdges.push(...childGraph.newEdges);
    });
  } else if (typeof json === 'object' && json !== null) {
    let childOffset = xOffset;
    Object.entries(json).forEach(([key, value]) => {
      const childId = `${currentId}=${key}`;
      const childSubtreeWidth = getSubtreeWidth(value) * xSpacing;
      const childGraph = calculateTreeLayout(value, currentId, childId, depth + 1, childOffset);

      childOffset += childSubtreeWidth;

      newNodes.push(...childGraph.newNodes);
      newEdges.push(...childGraph.newEdges);
    });
  } else {
    const valueId = `${currentId}-value`;
    const valueX = nodeX;
    const valueY = nodeY + ySpacing / 2;

    newNodes.push({
      id: valueId,
      data: { label: `${json}` },
      position: { x: valueX, y: valueY },
      style: { width: 100, padding: '10px', textAlign: 'center', backgroundColor: '#FFD700' },
    });

    newEdges.push({
      id: `e-${currentId}-${valueId}`,
      source: currentId,
      target: valueId,
    });
  }

  return { newNodes, newEdges };
};
