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
 
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    
}

interface TextNode {
    text: string
}

export const TextField: React.FC<Props> = ({handleChange}) => {

    const [count, setCount] = useState<TextNode>({text:'hello'});
    const inputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLInputElement>(null);


    return(
        <div ref={divRef}>
            <input ref={inputRef} onChange={handleChange}/>

        </div>
    )

}