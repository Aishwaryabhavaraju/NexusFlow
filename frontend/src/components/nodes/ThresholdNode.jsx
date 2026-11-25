import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Gauge } from "lucide-react";

const ThresholdNode = ({ id, data, selected }) => {
  const getOpDisplay = (op) => {
    switch (op) {
      case "gt": return ">";
      case "gte": return "≥";
      case "lt": return "<";
      case "lte": return "≤";
      case "eq": return "=";
      default: return "≥";
    }
  };

  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-rose-400 ring-2 ring-rose-400/30 shadow-rose-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-rose-400 !border-slate-900 !w-3 !h-3"
      />

      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20">
          <Gauge className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-400">
            Condition Node
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "Threshold"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Condition:</span>
          <span className="font-mono font-medium text-rose-300 bg-rose-950/60 px-1.5 py-0.5 rounded">
            value {getOpDisplay(data.operator)} {data.value !== undefined ? data.value : 80}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-rose-400 !border-slate-900 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(ThresholdNode);
