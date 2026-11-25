import React from "react";
import { Radio, SlidersHorizontal, Calculator, Gauge, MessageSquare, Zap, Plus } from "lucide-react";

const NODE_PALETTE_ITEMS = [
  {
    type: "sensor",
    label: "Sensor Source",
    description: "Ingests readings by device & metric",
    icon: Radio,
    color: "cyan",
    defaultData: {
      label: "Turbine Sensor",
      deviceId: "TURBINE-001",
      metric: "temperature"
    }
  },
  {
    type: "movingAverage",
    label: "Moving Average",
    description: "Windowed noise smoothing",
    icon: SlidersHorizontal,
    color: "indigo",
    defaultData: {
      label: "Moving Average",
      windowSize: 3
    }
  },
  {
    type: "mathOperation",
    label: "Math Operation",
    description: "Add, subtract, multiply, divide",
    icon: Calculator,
    color: "amber",
    defaultData: {
      label: "Math Operation",
      operation: "multiply",
      operand: 1
    }
  },
  {
    type: "threshold",
    label: "Threshold Filter",
    description: "Comparison condition (>, >=, <, <=, =)",
    icon: Gauge,
    color: "rose",
    defaultData: {
      label: "Threshold",
      operator: "gte",
      value: 80
    }
  },
  {
    type: "smsAlert",
    label: "SMS Alert",
    description: "Terminal SMS notification",
    icon: MessageSquare,
    color: "purple",
    defaultData: {
      label: "SMS Alert",
      message: "High temperature alert detected!"
    }
  },
  {
    type: "actionTrigger",
    label: "Action Trigger",
    description: "Trigger alert action & stream event",
    icon: Zap,
    color: "emerald",
    defaultData: {
      label: "Action Trigger",
      actionType: "alert",
      message: "Threshold rule triggered!"
    }
  }
];

const NodePalette = ({ onAddNode }) => {
  const onDragStart = (event, nodeItem) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeItem));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md p-4 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Node Palette
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Drag onto canvas or click to add
        </p>
      </div>

      <div className="space-y-2.5 overflow-y-auto pr-1">
        {NODE_PALETTE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              draggable
              onDragStart={(e) => onDragStart(e, item)}
              onClick={() => onAddNode(item)}
              className="group relative flex cursor-grab items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-lg transition-all active:cursor-grabbing"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-300 group-hover:text-cyan-400 ring-1 ring-slate-800 transition-colors">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-white">
                    {item.label}
                  </h4>
                  <Plus className="h-3 w-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">Quick Tip</p>
          <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
            Connect nodes from left to right: Source &rarr; Filter &rarr; Condition &rarr; Action.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default NodePalette;
