import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Zap } from "lucide-react";

const ActionTriggerNode = ({ id, data, selected }) => {
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-emerald-400 ring-2 ring-emerald-400/30 shadow-emerald-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-emerald-400 !border-slate-900 !w-3 !h-3"
      />

      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
          <Zap className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
            Action Node
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "Action Trigger"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Type:</span>
          <span className="font-mono font-medium text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded capitalize">
            {data.actionType || "alert"}
          </span>
        </div>
        <div className="text-slate-400">
          <span className="block mb-1">Alert Message:</span>
          <p className="font-sans text-[11px] text-slate-200 bg-slate-800/80 p-1.5 rounded line-clamp-2 italic">
            "{data.message || "Threshold condition satisfied"}"
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-emerald-400 !border-slate-900 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(ActionTriggerNode);
