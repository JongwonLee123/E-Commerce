const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint


router.get("/", async (req, res) => {

  try {

    const allTags = await Tag.findAll({
      include: [{ model: Product }], 
    });
   
    res.status(200).json(allTags);
  } catch (err) {
    
    res.status(500).json(err);
  }
});



router.get("/:id", async (req, res) => {
  try {
    const oneTag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }], 
    });
    res.status(200).json(oneTag);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.post("/", async (req, res) => {


  try {

    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    
    if (req.body.prodIds.length) {
      const productTagIdArr = req.body.prodIds.map((product_id) => {
        return {
          product_id,
          tag_id: newTag.id,
        };
      });
      ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(newTag);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});



router.put("/:id", async (req, res) => {
  try {
    const updTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const associatedProductTags = await ProductTag.findAll({
      where: {
        tag_id: req.params.id,
      },
    });

    const tagProductIds = associatedProductTags.map(
      ({ product_id }) => product_id
    );

    const newTagProducts = req.body.prodIds
      
      .filter((product_id) => !tagProductIds.includes(product_id))
      
      .map((product_id) => {
        return {
          product_id,
          tag_id: req.params.id,
        };
      });

    
    const tagProductsToRemove = associatedProductTags
  
      .filter(({ product_id }) => !req.body.prodIds.includes(product_id))
     
      .map(({ id }) => id);

    const completedActions = Promise.all([
      ProductTag.destroy({
        where: {
          id: tagProductsToRemove,
        },
      }),
      ProductTag.bulkCreate(newTagProducts),
    ]);


    res.status(200).json(updTag);
  } catch (err) {
 
    res.status(500).json(err);
  }
});


router.delete("/:id", async (req, res) => {

  try {

    const delTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
   
    res.status(200).json(delTag);
  } catch (err) {
    
    res.status(500).json(err);
  }
});

module.exports = router;