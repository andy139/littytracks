import React, { useState, useRef } from "react"

interface Person{
    firstName: string
    lastName: string
}

// mandatory props to be passed into component

interface Props {
    text: string;
    ok?: boolean; //field is optionally
    i?: number;
    fn?:(bob: string)=> string; //return string void takes in string and outputs string
    obj?: Person;
    
}

interface TextNode {
    text: string
}

export const TextField: React.FC<Props> = ({
}) => {

    const [count, setCount] = useState<TextNode>({text:'hello'});


    const inputRef = useRef<HTMLInputElement>(null);


    return(
        <div>
            <input ref={inputRef}/>
        </div>
    )

}