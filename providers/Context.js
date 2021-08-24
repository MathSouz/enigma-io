import React, { useEffect } from 'react'
import { createContext, useState } from "react";

export const Context = createContext({})

export function ContextProvider(props)
{
    const [ token, setToken ] = useState()

    useEffect(() => {
        console.log(token);
    }, [])

    return(
        <Context.Provider value={token, setToken}>
            {
                props.children
            }
        </Context.Provider>
    )
}