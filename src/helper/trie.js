class TrieNode {
    constructor(char) {
        this.childNodes = {}
        this.isWordEnd = false
        this.char = char
        this.weight = 0
    }
}


export default class Trie {
    constructor(wordArr) {
        this.root = TrieNode('')
        this.createTrie(wordArr)
    }

    createTrie(arr) {


        
    }

    // Insert word in trie
    insertWord(word) {
        let currNode = this.root;

        for (let char of word) {
            let node = currNode.childNodes[char]

            if (!node) {
                currNode.childNodes[char] = new TrieNode(char)
            }

            currNode = currNode.childNodes[char]
        }

        currNode.isWordEnd = true;

        
    }





}