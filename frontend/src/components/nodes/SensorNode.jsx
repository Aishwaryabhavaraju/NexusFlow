import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Radio } from "lucide-react";

const SensorNode = ({ id, data, selected }) => {
  return (
    <div
      className={`min-w-[210px] rounded-xl border bg-slate-900/95 backdrop-blur-md p-3.5 shadow-xl transition-all ${
        selected
          ? "border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-500/20"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
          <Radio className="h-4 w-4" />
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
            Source Node
          </span>
          <h4 className="text-xs font-semibold text-slate-100">
            {data.label || "IoT Sensor"}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-slate-400">
          <span>Device ID:</span>
          <span className="font-mono font-medium text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded">
            {data.deviceId || "Not Set"}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Metric:</span>
          <span className="font-mono font-medium text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded">
            {data.metric || "Not Set"}
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-cyan-400 !border-slate-900 !w-3 !h-3"
      />
    </div>
  );
};

export default memo(SensorNode);
