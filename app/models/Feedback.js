import {Schema, model, models} from "mongoose";

const feedbackSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    uploads: {type: [String]},
    userEmail: {type: String, required: true},
}, {timestamps: true});

export const Feedback = models?.Feedback || model('Feedback', feedbackSchema);