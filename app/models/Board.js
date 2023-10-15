import {model, models, Schema} from "mongoose";

const boardSchema = new Schema({
    adminEmail: {type: String, required: true},
    name: {type: String, required: true},
    slug: {type: String, required: true, min: 3, unique: true},
    description: {type: String, default: ""},
})

export const Board = models?.Board || model('Board', boardSchema);