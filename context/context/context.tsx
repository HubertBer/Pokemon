import { getFavouritePokemon } from "@/storage/PokeStorage";
import { createContext, useEffect } from "react";

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
    pokemonName : string,
    setPokemonName : (s : string) => void,
}

export function FavouritePokemonProvider( {children, pokemonName, setPokemonName} : Props) {
    // const [favouritePokemonName, setFavouritePokemonName] = useState<string>('')
    useEffect(() => {getFavouritePokemon().then(setPokemonName)}, []);

    console.log(typeof children)

    return (
        <FavouritePokemon.Provider value = {{
            favouritePokemonName : pokemonName, 
            setFavouritePokemonName : setPokemonName
        }}>
            {children}
        </FavouritePokemon.Provider>
    );
}

export function SelectedPokemonProvider ({children, pokemonName, setPokemonName} : Props ) {
    // const [selectedPokemonName, setSelectedPokemonName] = useState('')

    return (
        <SelectedPokemon.Provider value = {{
            selectedPokemonName : pokemonName,
            setSelectedPokemonName : setPokemonName,
        }}>
            {children}
        </SelectedPokemon.Provider>
    )
}

type VisibleProps = {
    children? : React.ReactNode,
    visibleTiles : Set<number>,
}

export const VisibleTiles = createContext<{visibleTiles: Set<number>}>({visibleTiles: new Set([])})

export function VisibleTilesProvider ({children, visibleTiles} : VisibleProps) {
    return (
        <VisibleTiles.Provider
            value = {{
                visibleTiles : visibleTiles
            }}
        >
            {children}
        </VisibleTiles.Provider>
    )
}