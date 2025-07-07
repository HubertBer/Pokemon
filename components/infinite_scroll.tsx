import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { PokeListTile } from "./PokemonListComponents";

export default function InfiniteScrollPokeList() {
    const [pokemons, setPokemons] = useState<{name : string}[]>([]);
    const loadMorePokemons = () => {
        fetch('https://pokeapi.co/api/v2/pokemon/?limit=10&offset=' + pokemons.length)
        .then(resp => resp.json())
        .then( ({count, results}) => {
            setPokemons([...pokemons, ...results])
        })
    }


    console.log('https://pokeapi.co/api/v2/pokemon/?limit=100&offset=' + pokemons.length)
    useEffect(loadMorePokemons, [])

    return <>
        <FlatList 
            data = {pokemons}
            renderItem = {({item}) => {return <PokeListTile name={item.name}/>;}}
            onEndReached={loadMorePokemons}
        />
        {/* <FlatList
            data = {['charizard', 'charmander', 'psyduck']}
            renderItem = {({item}) => {
                return (
                    <PokeListTile name = {item}/>
                );
            }}
        >
        </FlatList> */}
    </>
} 