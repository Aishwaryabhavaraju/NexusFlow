import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { SlidersHorizontal } from "lucide-react";

const MovingAverageNode = ({ id, data, selected }) => {
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-indigo-400 ring-2 ring-indigo-400/30 shadow-indigo-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-indigo-400 !border-slate-900 !w-3 !h-3"
      />

      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
            Filter Node
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "Moving Average"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Window Size:</span>
          <span className="font-mono font-medium text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded">
            {data.windowSize || 3} readings
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-indigo-400 !border-slate-900 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(MovingAverageNode);
