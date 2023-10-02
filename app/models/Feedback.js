import {Schema, model, models} from "mongoose";
import './User';

const feedbackSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    uploads: {type: [String]},
    userEmail: {type: String, required: true},
}, {
    timestamps: true,
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
});

feedbackSchema.virtual('user', {
    ref: 'User',
    localField: 'userEmail',
    foreignField: 'email',
    justOne: true,
})

export const Feedback = models?.Feedback || model('Feedback', feedbackSchema);