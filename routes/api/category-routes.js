const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  const categoryData = await Category.findAll({
    include: [{ model: Product }],
  });
  res.status(200).json(categoryData);
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  });
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with this id!' });
    return;
  }
  res.status(200).json(categoryData);
});

router.post('/', async (req, res) => {
  // create a new category
  const categoryData = await Category.create(req.body);
    res.status(201).json(categoryData);
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  const categoryData = await Category.update(req.body, {
    where: { id: req.params.id },
  });
  if (!categoryData[0]) {
    res.status(404).json({ message: 'No category found with this id!' });
    return;
  }
  res.status(200).json(categoryData);
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const products = await Product.findAll({ where: { category_id: req.params.id } });
  //need to update category values in existing products due to foriegn key relationships
    if (products.length > 0) {
      console.log('updating products')
      //perform the update to products
      await Product.update({ category_id: null }, { where: { category_id: req.params.id } });

      return res.status(400).json({ message: 'Category has associated products. Please handle them before deleting.' });
    }
    // delete the category after the update of if it there are no products associated
  const categoryData = await Category.destroy({
    where: { id: req.params.id },
  });
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with this id!' });
    return;
  }
  res.status(200).json(categoryData);
});

module.exports = router;
