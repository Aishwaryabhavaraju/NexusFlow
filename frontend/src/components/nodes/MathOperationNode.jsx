import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Calculator } from "lucide-react";

const MathOperationNode = ({ id, data, selected }) => {
  const getOpSymbol = (op) => {
    switch (op) {
      case "add": return "+";
      case "subtract": return "−";
      case "multiply": return "×";
      case "divide": return "÷";
      default: return "+";
    }
  };

  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-amber-400 ring-2 ring-amber-400/30 shadow-amber-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-amber-400 !border-slate-900 !w-3 !h-3"
      />

      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
          <Calculator className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            Transform Node
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "Math Operation"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Operation:</span>
          <span className="font-mono font-medium text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded capitalize">
            {data.operation || "add"} ({getOpSymbol(data.operation)})
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Operand:</span>
          <span className="font-mono font-medium text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {data.operand !== undefined ? data.operand : 0}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-amber-400 !border-slate-900 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(MathOperationNode);
