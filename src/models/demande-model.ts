import mongoose, { Schema, Document } from "mongoose";

interface IDemande extends Document {
    _id?: any;
    userKey: string;
    nom_prenoms: string;
    statut?: number;
    data?: any;
    agents?: any;
    createdAt?: any;
    updatedAt?: any;
}

const DSchema = new Schema(
    {
        userKey: String,
        nom_prenoms: String,
        statut: {
            type: Number,
            required: true,
            default: 0
        },
        data: Array,
        agents: Array
    },
    {
        timestamps: true
    }
);

export const Demande = mongoose.model<IDemande>('file-treatment', DSchema);