import Product from '../models/Product.js';

export async function createProduct(req, res) {
  try {
    const { name, price, category, sizes, colors, material } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = await Product.create({
      name, price, category, sizes: sizes.split(','), colors: colors.split(','),
      material, image: imageUrl,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
}

export async function getCategories(req, res) {
  try {
    const cats = await Product.distinct('category');
    res.json(cats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving categories' });
  }
}

export async function getSizes(req, res) {
  try {
    const sizes = await Product.distinct('sizes');
    res.json(sizes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving sizes' });
  }
}

export async function getColors(req, res) {
  try {
    const colors = await Product.distinct('colors');
    res.json(colors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving colors' });
  }
}

export async function getProducts(req, res) {
  try {
    const { category, sizes, colors, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (sizes)    filter.sizes    = { $in: sizes.split(',') };
    if (colors)   filter.colors   = { $in: colors.split(',') };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const prods = await Product.find(filter);
    res.json(prods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
}
