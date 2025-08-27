import { model, Schema } from 'mongoose';

// Review Schema
const reviewSchema = new Schema(
    {
        image: { type: String, required: true},
        image_id: { type: String, required: true},
        created_by: {
            id: { type: String, required: true },
            name: { type: String, required: true },
        },
        dog: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true, default: 5 },
    },
    {
        timestamps: true,
    }
);

export const ReviewModel = model('review', reviewSchema);