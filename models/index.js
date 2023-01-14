const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

Product.belongsTo(Category, {
  foreignKey: "category_id",
});

Category.hasMany(Product, {
  // onDelete: 'CASCADE',
});

Product.belongsToMany(Tag, {
  through: "product_tag",
});

Tag.belongsToMany(Product, {
  through: "product_tag",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};