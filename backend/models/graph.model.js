const mongoose = require("mongoose");

const graphSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        nodes: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        },

        edges: {
            type: [mongoose.Schema.Types.Mixed],
            required: true
        },

        status: {
            type: String,
            enum: ["draft", "active", "inactive"],
            default: "draft"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Graph", graphSchema);

