import mongoose, { Schema, Document } from 'mongoose';

interface IPolygone extends Document {
    name: string;
    location: {
        type: string;
        features: any;
        bbox: any;
    };
}

const PolygoneSchema = new Schema({
    name: String,
    location: {
        type: { type: String },
        features: Array,
        bbox: Array
    }
});

const Polygones = mongoose.model<IPolygone>('polygones2', PolygoneSchema);
export { Polygones, IPolygone }