import mongoose from 'mongoose';


const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

const imageSchema = new mongoose.Schema(
    {
        image: { type: String },
    }
);

const descriptionSchema = new mongoose.Schema(
    {
        description: { type: String },
    }
);
const sizeSchema = new mongoose.Schema(
    {
        size: { type: Number },
    }
);
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        images: [imageSchema],
        gender: { type: String, required: true },
        category: { type: String, required: true },
        descriptions: [descriptionSchema],
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        rating: { type: Number, required: true },
        numReviews: { type: Number, required: true },
        reviews: [reviewSchema],
        size: [sizeSchema],
    },
    {
        timestamps: true,
    }
);


const Product = mongoose.model('Product', productSchema);

export default Product;