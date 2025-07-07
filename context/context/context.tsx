import { getFavouritePokemon } from "@/storage/PokeStorage";
import { createContext, useEffect, useState } from "react";

export const FavouritePokemon = createContext<{ favouritePokemonName : string, setFavouritePokemonName : (name : string) => void}>({favouritePokemonName : '', setFavouritePokemonName : (name : string) => {}});

export const SelectedPokemon = createContext<{
    selectedPokemonName : string,
    setSelectedPokemonName : (name : string) => void,
}>({
    selectedPokemonName : '',
    setSelectedPokemonName : () => {},
})

type Props = {
    children? : React.ReactNode,
}
export function FavouritePokemonProvider( {children} : Props) {
    const [favouritePokemonName, setFavouritePokemonName] = useState<string>('')
    useEffect(() => {getFavouritePokemon().then(setFavouritePokemonName)}, []);

    console.log(typeof children)

    return (
        <FavouritePokemon.Provider value = {{
            favouritePokemonName : favouritePokemonName, 
            setFavouritePokemonName : setFavouritePokemonName
        }}>
            {children}
        </FavouritePokemon.Provider>
    );
}

export function SelectedPokemonProvider ({children} : Props ) {
    const [selectedPokemonName, setSelectedPokemonName] = useState('')

    return (
        <SelectedPokemon.Provider value = {{
            selectedPokemonName : selectedPokemonName,
            setSelectedPokemonName : setSelectedPokemonName,
        }}>
            {children}
        </SelectedPokemon.Provider>
    )
}