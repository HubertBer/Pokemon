import { SelectedPokemon, VisibleTilesProvider } from "@/context/context/context";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { PokeListTile } from "./PokemonListComponents";

export default function InfiniteScrollPokeList() {
    const {selectedPokemonName, setSelectedPokemonName} = useContext(SelectedPokemon)
    const [pokemons, setPokemons] = useState<{name : string}[]>([])
    const [visibleTiles, setVisibleTiles] = useState<Set<number>>(new Set([]))

    const loadMorePokemons = () => {
        fetch('https://pokeapi.co/api/v2/pokemon/?limit=4&offset=' + pokemons.length)
        .then(resp => resp.json())
        .then( ({count, results}) => {
            setPokemons([...pokemons, ...results])
        })
    }


    useEffect(loadMorePokemons, [])

    return (
        <VisibleTilesProvider
            visibleTiles={visibleTiles}
        >
            <FlatList 
                data = {[...pokemons, {name: 'loadingCircle'}]}
                renderItem = {({item, index}) => {
                    if (item.name == 'loadingCircle') {
                        return <ActivityIndicator size={50}/>
                    }
                    return <PokeListTile name={item.name} setSelectedPokemonName={setSelectedPokemonName} index={index}/>
                }}
                onEndReached={loadMorePokemons}
                // onViewableItemsChanged={
                //     ({changed, viewableItems}) => {
                //         var vis : Set<number> = new Set([]);
                //         changed.forEach(c => {
                //             if (c.index) {
                //                 vis.add(c.index)
                //             }
                //         })
                //         setVisibleTiles(vis)
                //     }
                // }
            />
        </VisibleTilesProvider>)
} 