const productsRouter = require('express').Router()
const Product = require('../models/product')

const formatProduct = product => ({
  _id: product._id,
  sku: product.sku,
  type: product.type,
  price: product.price,
  details: {
    title: product.details.title,
    description: product.details.description,
    // image: product.details.image,
    date_added: product.details.date_added,
  },
})

productsRouter.get('/', async (request, response) => {
  try {
    const products = await Product.find({})
    return response.json(products.map(formatProduct)).status(200)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.get('/:id', async (request, response) => {
  try {
    const product = await Product.findById(request.params.id)
    console.log(product)
    return response.json(formatProduct(product)).status(201)
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.post('/', async (request, response) => {
  try {
    const { body } = request
    console.log('body', body)

    const product = new Product({
      sku: body.sku,
      type: body.type,
      price: body.price,
      details: {
        title: body.details.title,
        description: body.details.description,
        // image: body.details.image,
        date_added: Date(),
      },
    })

    console.log(product)

    const savedProduct = await product.save()

    return response.json(formatProduct(savedProduct))
  } catch (error) {
    console.log(error)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.put('/:id', async (request, response) => {
  try {
    const { body } = request
    console.log(body)

    const product = {
      sku: body.sku,
      type: body.type,
      price: body.price,
      details: {
        title: body.details.title,
        description: body.details.description,
        // image: body.details.image,
        date_added: body.details.date_added,
      },
    }

    await Product.findByIdAndUpdate(request.params.id, product, { new: true })
    return response.status(200).json(formatProduct(product))
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'something went wrong' })
  }
})

productsRouter.delete('/:id', async (request, response) => {
  try {
    await Product.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (exception) {
    console.log(exception)
    return response.status(400).json({ error: 'someting went wrong' })
  }
})

module.exports = productsRouter