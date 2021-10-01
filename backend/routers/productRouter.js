import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';

import { isAuth } from '../utils.js';
const productRouter = express.Router();

productRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {

        const pageSize = 8;
        const page = Number(req.query.page) || 1;
        const name = req.query.name || '';
        const category = req.query.category || '';
        const gender = req.query.gender || '';
        const order = req.query.order || '';
        const size = req.query.size || '';
        const min =
            req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
        const max =
            req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;

        const categoryFilter = category ? { category } : {};
        const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
        const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
        const genderFilter = gender ? { gender } : {};
        const sizeFilter = size ? { size } : {};
        const sortOrder =
            order === 'lowest'
                ? { price: 1 }
                : order === 'highest'
                    ? { price: -1 }
                    : order === 'toprated'
                        ? { rating: -1 }
                        : { _id: -1 };
        const count = await Product.count({
            ...nameFilter, ...categoryFilter, ...priceFilter, ...genderFilter, ...sizeFilter
        });
        const products = await Product.find({
            ...nameFilter, ...categoryFilter, ...priceFilter, ...genderFilter, ...sizeFilter
        }).sort(sortOrder).skip(pageSize * (page - 1))
            .limit(pageSize);
        res.send({ products, count, page, pages: Math.ceil(count / pageSize) });
    })
);

productRouter.get(
    '/categories',
    expressAsyncHandler(async (req, res) => {
        const categories = await Product.find().distinct('category');
        res.send(categories);
    })
);

productRouter.get(
    '/home',
    expressAsyncHandler(async (req, res) => {
        const male = await Product.find({ gender: 'male' }).limit(3);
        const famale = await Product.find({ gender: 'famale' }).limit(3);
        res.send({ male, famale });
    })
);


productRouter.get(
    '/seed',
    expressAsyncHandler(async (req, res) => {
        // await Product.remove({});
        const createdProducts = await Product.insertMany(data.products);
        res.send({ createdProducts });
    })
);

productRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.post(
    '/',
    expressAsyncHandler(async (req, res) => {
        const product = new Product({
            name: 'samle name ' + Date.now(),
            price: 0,
            category: 'sample category',
            gender: 'sample brand',
            countInStock: 0,
            rating: 0,
            numReviews: 0,
        });
        const createdProduct = await product.save();
        res.send({ message: 'Product Created', product: createdProduct });
    })
);


productRouter.put(
    '/update/:id',
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        console.log(req.body.name)
        const product = await Product.findById(productId);
        if (product) {
            product.name = req.body.name;
            product.price = req.body.price;
            product.category = req.body.category;
            product.gender = req.body.gender;
            product.countInStock = req.body.countInStock;
            const updatedProduct = await product.save();
            res.send({ message: 'Product Updated', product: updatedProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.delete(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (product) {
            const deleteProduct = await product.remove();
            res.send({ message: 'Product Deleted', product: deleteProduct });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {

            const review = {
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Review Created',
                review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
            });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

productRouter.post(
    '/images/images/:id',
    expressAsyncHandler(async (req, res) => {
        console.log("asdsadsa");
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product) {
            const image = {
                image: req.body.image
            };
            product.images.push(image);
            const updatedProduct = await product.save();
            res.status(201).send({
                message: 'Add images congra',
                image: updatedProduct.images[updatedProduct.images.length - 1],
            });
        } else {
            res.status(404).send({ message: 'Product Not Found' });
        }
    })
);

export default productRouter;