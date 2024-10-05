export { Tokenizer } from "./Tokenizer"
export { Token } from "./Token"
export { KeywordMap } from "./KeywordMap"
export { Result } from "./Result"
export { TokenType } from "./TokenType"

// import fs from "fs"
// import { Tokenizer } from "./Tokenizer"
//
// let fml = fs.readFileSync("assets/FORM0001.fml" ).toString()
//
// let tokenizer = new Tokenizer(fml)
// let token = tokenizer.Tokenize()
// if(token.error) {
//     console.log(token.error)
// }