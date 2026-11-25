import React from "react";
import { X, Trash2, Sliders, Radio, SlidersHorizontal, Calculator, Gauge, MessageSquare, Zap } from "lucide-react";

const NodeConfigPanel = ({ selectedNode, updateNodeData, deleteNode, onClose }) => {
  if (!selectedNode) return null;

  const { id, type, data } = selectedNode;

  const handleChange = (field, value) => {
    updateNodeData(id, { ...data, [field]: value });
  };

  const getIcon = () => {
    switch (type) {
      case "sensor": return <Radio className="h-4 w-4 text-cyan-400" />;
      case "movingAverage": return <SlidersHorizontal className="h-4 w-4 text-indigo-400" />;
      case "mathOperation": return <Calculator className="h-4 w-4 text-amber-400" />;
      case "threshold": return <Gauge className="h-4 w-4 text-rose-400" />;
      case "smsAlert": return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case "actionTrigger": return <Zap className="h-4 w-4 text-emerald-400" />;
      default: return <Sliders className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="absolute right-4 top-20 z-10 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-5 shadow-2xl shadow-black/60 transition-all">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 capitalize">
              {type.replace(/([A-Z])/g, " $1")} Settings
            </h3>
            <span className="text-[10px] font-mono text-slate-400">ID: {id}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4 text-xs">
        {/* Label */}
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Node Label
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            placeholder="e.g. Turbine Sensor"
          />
        </div>

        {/* SENSOR CONFIG */}
        {type === "sensor" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Device ID
              </label>
              <input
                type="text"
                value={data.deviceId || ""}
                onChange={(e) => handleChange("deviceId", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="TURBINE-001"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Metric Name
              </label>
              <input
                type="text"
                value={data.metric || ""}
                onChange={(e) => handleChange("metric", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                placeholder="temperature"
              />
            </div>
          </>
        )}

        {/* MOVING AVERAGE CONFIG */}
        {type === "movingAverage" && (
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Window Size (Readings)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={data.windowSize !== undefined ? data.windowSize : 3}
              onChange={(e) => handleChange("windowSize", parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Calculates rolling average over the last N readings.
            </p>
          </div>
        )}

        {/* MATH OPERATION CONFIG */}
        {type === "mathOperation" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Operation
              </label>
              <select
                value={data.operation || "add"}
                onChange={(e) => handleChange("operation", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (−)</option>
                <option value="multiply">Multiply (×)</option>
                <option value="divide">Divide (÷)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Operand Value
              </label>
              <input
                type="number"
                step="any"
                value={data.operand !== undefined ? data.operand : 0}
                onChange={(e) => handleChange("operand", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </>
        )}

        {/* THRESHOLD CONFIG */}
        {type === "threshold" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Comparison Operator
              </label>
              <select
                value={data.operator || "gte"}
                onChange={(e) => handleChange("operator", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="gt">Greater Than (&gt;)</option>
                <option value="gte">Greater Than or Equal (&ge;)</option>
                <option value="lt">Less Than (&lt;)</option>
                <option value="lte">Less Than or Equal (&le;)</option>
                <option value="eq">Equal To (=)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Threshold Value
              </label>
              <input
                type="number"
                step="any"
                value={data.value !== undefined ? data.value : 80}
                onChange={(e) => handleChange("value", parseFloat(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-100 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </>
        )}

        {/* SMS ALERT CONFIG */}
        {type === "smsAlert" && (
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
              SMS Alert Message
            </label>
            <textarea
              rows="3"
              value={data.message || ""}
              onChange={(e) => handleChange("message", e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="e.g. Critical temperature exceeded 85 degrees!"
            />
          </div>
        )}

        {/* ACTION TRIGGER CONFIG */}
        {type === "actionTrigger" && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Action Type
              </label>
              <select
                value={data.actionType || "alert"}
                onChange={(e) => handleChange("actionType", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="alert">System Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Notification Message
              </label>
              <textarea
                rows="3"
                value={data.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="e.g. High turbine temperature detected!"
              />
            </div>
          </>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={() => deleteNode(id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2 text-rose-400 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Node</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
