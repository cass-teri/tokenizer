import { Tokenizer } from '../src/Tokenizer'
import { TokenType } from '../src/TokenType'
import { Result } from '../src/Result'
import { Token } from '../src/Token'
import {describe, it} from "node:test"
import {expect} from "chai"
import exp = require("node:constants")

describe('Tokenizer', () => {
    it('Tokenizes single character tokens', () => {
        const tokenizer = new Tokenizer('(){}[],.-+*/')
        const result = tokenizer.Tokenize()

        expect(result.value).to.be.an.instanceOf(Array)
        expect(result.value).to.not.be.null
        // @ts-ignore we're checking for null above
        expect(result.value.length).equals(13)

        // @ts-ignore we're checking for null above
        expect(result.value[0].token_type).equals(TokenType.LEFT_PARENTHESIS)
        // @ts-ignore we're checking for null above
        expect(result.value[1].token_type).equals(TokenType.RIGHT_PARENTHESIS)
        // @ts-ignore we're checking for null above
        expect(result.value[2].token_type).equals(TokenType.LEFT_BRACE)
        // @ts-ignore we're checking for null above
        expect(result.value[3].token_type).equals(TokenType.RIGHT_BRACE)
        // @ts-ignore we're checking for null above
        expect(result.value[4].token_type).equals(TokenType.LEFT_BRACKET)
        // @ts-ignore we're checking for null above
        expect(result.value[5].token_type).equals(TokenType.RIGHT_BRACKET)
        // @ts-ignore we're checking for null above
        expect(result.value[6].token_type).equals(TokenType.COMMA)
        // @ts-ignore we're checking for null above
        expect(result.value[7].token_type).equals(TokenType.DOT)
        // @ts-ignore we're checking for null above
        expect(result.value[8].token_type).equals(TokenType.MINUS)
        // @ts-ignore we're checking for null above
        expect(result.value[9].token_type).equals(TokenType.PLUS)
        // @ts-ignore we're checking for null above
        expect(result.value[10].token_type).equals(TokenType.ASTERISK)
        // @ts-ignore we're checking for null above
        expect(result.value[11].token_type).equals(TokenType.FORWARD_SLASH)
        // @ts-ignore we're checking for null above
        expect(result.value[12].token_type).equals(TokenType.EOF)

    })

    it('Tokenizes multi-character tokens', () => {
        const tokenizer = new Tokenizer('!= == <= >=')
        const result = tokenizer.Tokenize()

        expect(result.value).to.be.an.instanceOf(Array)
        expect(result.value).to.not.be.null
        // @ts-ignore we're checking for null above
        expect(result.value[0].token_type).equals(TokenType.EXCLAMATION_POINT_EQUAL)
        // @ts-ignore we're checking for null above
        expect(result.value[1].token_type).equals(TokenType.EQUAL_EQUAL)
        // @ts-ignore we're checking for null above
        expect(result.value[2].token_type).equals(TokenType.LESS_THAN_EQUAL)
        // @ts-ignore we're checking for null above
        expect(result.value[3].token_type).equals(TokenType.GREATER_THAN_EQUAL)
        // @ts-ignore we're checking for null above
        expect(result.value[4].token_type).equals(TokenType.EOF)

    })

    it('Tokenizes numbers', () => {
        const tokenizer = new Tokenizer('123 45.67')
        const result = tokenizer.Tokenize()

        expect(result.value).to.be.an.instanceOf(Array)
        expect(result.value).to.not.be.null

        // @ts-ignore we're checking for null above
        expect(result.value[0].token_type).equals(TokenType.NUMBER)
        // @ts-ignore we're checking for null above
        expect(result.value[0].literal).equals(123)
        // @ts-ignore we're checking for null above
        expect(result.value[1].token_type).equals(TokenType.NUMBER)
        // @ts-ignore we're checking for null above
        expect(result.value[1].literal).equals(45.67)
        // @ts-ignore we're checking for null above
        expect(result.value[2].token_type).equals(TokenType.EOF)

    })

    it('Tokenizes strings', () => {
        const tokenizer = new Tokenizer('"hello" "world"')
        const result = tokenizer.Tokenize()

        expect(result.value).to.be.an.instanceOf(Array)
        expect(result.value).to.not.be.null

        // @ts-ignore we're checking for null above
        expect(result.value[0].token_type).equals(TokenType.STRING)
        // @ts-ignore we're checking for null above
        expect(result.value[0].literal).equals('hello')
        // @ts-ignore we're checking for null above
        expect(result.value[1].token_type).equals(TokenType.STRING)
        // @ts-ignore we're checking for null above
        expect(result.value[1].literal).equals('world')
        // @ts-ignore we're checking for null above
        expect(result.value[2].token_type).equals(TokenType.EOF)

    })


    it('Handles unterminated strings', () => {
        const tokenizer = new Tokenizer('"unterminated')
        expect(() => tokenizer.Tokenize()).to.throw()
    })

    it('Handles unterminated markdown', () => {
        const tokenizer = new Tokenizer('form(){markdown () #{ #Header}')
        expect(() => tokenizer.Tokenize()).to.throw()
    })

    it('Ignores comments', () => {
        const tokenizer = new Tokenizer('// this is a comment\nform(){ text (id="name") }')
        const result = tokenizer.Tokenize()

        if (result.IsError()) {
            console.error(result.error)
        }
        if(result.value == null) {
            throw new Error("No value")
        }

        expect(result.value[0].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[1].token_type).to.equal(TokenType.LEFT_PARENTHESIS)
        expect(result.value[2].token_type).to.equal(TokenType.RIGHT_PARENTHESIS)
        expect(result.value[3].token_type).to.equal(TokenType.LEFT_BRACE)
        expect(result.value[4].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[5].token_type).to.equal(TokenType.LEFT_PARENTHESIS)
        expect(result.value[6].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[7].token_type).to.equal(TokenType.EQUAL)
        expect(result.value[8].token_type).to.equal(TokenType.STRING)
        expect(result.value[9].token_type).to.equal(TokenType.RIGHT_PARENTHESIS)
        expect(result.value[10].token_type).to.equal(TokenType.RIGHT_BRACE)
        expect(result.value[11].token_type).to.equal(TokenType.EOF)

    })

    it ("Should not choke on an escaped quote", () => {
        const tokenizer = new Tokenizer('form(){ text (id="before\\"after") }')
        const result = tokenizer.Tokenize()
        if (result.isError) {
            console.error(result.error)
        }
        if(result.value == null) {
            throw new Error("No value")
        }
        expect(result.value[0].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[1].token_type).to.equal(TokenType.LEFT_PARENTHESIS)
        expect(result.value[2].token_type).to.equal(TokenType.RIGHT_PARENTHESIS)
        expect(result.value[3].token_type).to.equal(TokenType.LEFT_BRACE)
        expect(result.value[4].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[5].token_type).to.equal(TokenType.LEFT_PARENTHESIS)
        expect(result.value[6].token_type).to.equal(TokenType.IDENTIFIER)
        expect(result.value[7].token_type).to.equal(TokenType.EQUAL)
        expect(result.value[8].token_type).to.equal(TokenType.STRING)
        expect(result.value[9].token_type).to.equal(TokenType.RIGHT_PARENTHESIS)
        expect(result.value[10].token_type).to.equal(TokenType.RIGHT_BRACE)
        expect(result.value[11].token_type).to.equal(TokenType.EOF)
    })
})