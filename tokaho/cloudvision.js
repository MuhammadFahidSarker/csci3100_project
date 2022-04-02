const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient({
  keyFilename: './SDK/notesKeyFeature.json',
})

async function read(fileName) {
  //fileName = './photo_examples/figure-65.png'
  const [result] = await client.documentTextDetection(`${fileName}`)
  const fullTextAnnotation = result.fullTextAnnotation
  console.log(`Full text:`)
  console.log(`${fullTextAnnotation.text}`)
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

read('./photo_examples/figure-65.png')

module.exports = {
  read,
}
