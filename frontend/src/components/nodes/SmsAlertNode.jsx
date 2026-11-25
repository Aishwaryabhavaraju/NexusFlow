import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { MessageSquare } from "lucide-react";

const SmsAlertNode = ({ id, data, selected }) => {
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-purple-400 ring-2 ring-purple-400/30 shadow-purple-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-purple-400 !border-slate-900 !w-3 !h-3"
      />

      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
            Action (Terminal)
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "SMS Alert"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="text-slate-400">
          <span className="block mb-1">Message:</span>
          <p className="font-sans text-[11px] text-slate-200 bg-slate-800/80 p-1.5 rounded line-clamp-2 italic">
            "{data.message || "Alert triggered!"}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(SmsAlertNode);
