import { getFavouritePokemon } from "@/storage/PokeStorage";
import { createContext, useEffect, useState } from "react";

export const FavouritePokemon = createContext<{ favouritePokemonName : string, setFavouritePokemonName : (name : string) => void}>({favouritePokemonName : '', setFavouritePokemonName : (name : string) => {}});

export function FavouritePokemonProvider( {children} ) {
    const [favouritePokemonName, setFavouritePokemonName] = useState<string>('')
    useEffect(() => {getFavouritePokemon().then(setFavouritePokemonName)}, []);

    return (
        <FavouritePokemon.Provider value = {{
            favouritePokemonName : favouritePokemonName, 
            setFavouritePokemonName : setFavouritePokemonName
        }}>
            {children}
        </FavouritePokemon.Provider>
    );
}