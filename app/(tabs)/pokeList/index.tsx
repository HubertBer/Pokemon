import { PokeListTile } from '@/components/PokemonListComponents';
import { SelectedPokemon } from '@/context/context/context';
import { Link } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Text, View } from "react-native";

export default function Pokelist() {
    const {selectedPokemonName, setSelectedPokemonName} = useContext(SelectedPokemon)
    const [pokeCount, setPokeCount] = useState(10)

    const getPokeCount = async () => {
        return await fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(resp => resp.json())
        .then(json => json.count)
        .then(setPokeCount)
    }
    useEffect(() => {getPokeCount()}, [])

    const [pokeList, setPokeList] = useState<any[]>([])
    const getPokeList = async () => {
        return await fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + pokeCount)
        .then(resp => resp.json())
        .then(json => json.results)
        .then(setPokeList)
    }
    useEffect(() => {getPokeList()}, [pokeCount])

    const keys = Array.from({length : pokeCount}, (v, i) => {return {key: i}})

    console.log('refresh pokelist')
    console.log('Hej co jest')

    return <>
        <View>
            <Text>Here will be a list of pokemons!</Text>
            <Text>{pokeCount}</Text>
            <Link
                href = '/pokeList/stats'
            >
                Open stats
            </Link>
            <FlatList
                data={pokeList}
                renderItem = {({item}) => {
                    return (
                        <PokeListTile name={item.name} setSelectedPokemonName={setSelectedPokemonName}/>
                    )
                }}
            />
        </View>
    </>
}