class TrieNode {
    constructor(char) {
        this.childNodes = {}
        this.isWordEnd = false
        this.char = char
        this.weight = 0
        
    }

    size() {
        return this.childNodes.size;

    }
}


export default class Trie {
    constructor(wordArr) {
        this.root = new TrieNode('')
        this.createTrie(wordArr)
    }

    createTrie(arr) {

        for (let ele of arr) {
            this.insertWord(ele)
        }
    }


    
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

    showWords(string) {

        let wordArr = []

        // This will return subtree after walking through the input string
        let getRemainingTrie = (string, trie) => {
            let node = trie;
            while (string) {
                node = node.childNodes[string[0]]
                string = string.substr(1)
            }

            return node
        }

        // Return all words that begin with inputted string
        let wordArrHelper = (stringSoFar, trie) => {
            for (let node in trie.childNodes) {
                const child = trie.childNodes[node]
                let newString = stringSoFar + child.char;

                if (child.isWordEnd) {
                    wordArr.push(newString)
                }

                wordArrHelper(newString, child);

            }
        }


        let remainingTrie = getRemainingTrie(string, this.root);
        if (remainingTrie) {
            wordArrHelper(string, remainingTrie);
        }
        return wordArr;
    }

    test() {
        console.log('Word array down below')
        console.log(this.showWords('te'));
    }



}


let newNode = new Trie(['lol', 'test', 'xd', 'lololol', 'xd','lolololol','testies'])

