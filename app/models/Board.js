import {model, models, Schema} from "mongoose";

const boardSchema = new Schema({
    adminEmail: {type: String, required: true},
    name: {type: String, required: true},
})

export const Board = models?.Board || model('Board', boardSchema);