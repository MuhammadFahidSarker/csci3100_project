// library
const vision = require('@google-cloud/vision')
// client
const client = new vision.ImageAnnotatorClient({
  // keyFilename in SDK
  keyFilename: './SDK/test-96f35-firebase-adminsdk-m8zbg-8e10e14cd1.json',
})

class Assert extends Error {
  constructor(message) {
    super(message) // (1)
    this.name = 'Assertion'
    this.errormsg = message
  }
}

// dummy function to check routes
const checkread = async (req, res, next) => {
  //console.log(`Check Read Passed`)
  return res.status(200).json({ Success: `Check Read Passed` })
}

const scanfile = async (req, res, next) => {
  if (!req.body.fileName) {
    return res.status(401).json({
      Error: 'File not found',
    })
  }
  try {
    // Need to change the default relative url to the req.body.url
    const [result] = await client.documentTextDetection(
      `gs://test-96f35.appspot.com/images/${req.body.fileName}`,
    )
    console.log(result)
    const fullTextAnnotation = result.fullTextAnnotation
    console.log(`Full text:`)
    console.log(`${fullTextAnnotation.text}`)
    return res.status(200).json({
      Success: true,
      Content: `${fullTextAnnotation.text}`,
    })
    //return res.status(200).json({ Success: 'Success' })
  } catch (e) {
    console.log('Error', e)
    return res.status(401).json({
      Error: JSON.stringify(e, Object.getOwnPropertyNames(e)),
    })
  }
  // checks everything
  // fullTextAnnotation.pages.forEach((page) => {
  //   page.blocks.forEach((block) => {
  //     console.log(`Block confidence: ${block.confidence}`)
  //     block.paragraphs.forEach((paragraph) => {
  //       console.log(`Paragraph confidence: ${paragraph.confidence}`)
  //       paragraph.words.forEach((word) => {
  //         const wordText = word.symbols.map((s) => s.text).join('')
  //         console.log(`Word text: ${wordText}`)
  //         console.log(`Word confidence: ${word.confidence}`)
  //         word.symbols.forEach((symbol) => {
  //           console.log(`Symbol text: ${symbol.text}`)
  //           console.log(`Symbol confidence: ${symbol.confidence}`)
  //         })
  //       })
  //     })
  //   })
  // })
}

module.exports = {
  scanfile: scanfile,
}
