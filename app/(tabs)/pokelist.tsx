import { PokeListTile } from '@/components/PokemonListComponents';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Pokelist() {
    const [pokeCount, setPokeCount] = useState(10)
    const getPokeCount = async () => {
        return await fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(resp => resp.json())
        .then(json => json.count)
        .then(setPokeCount)
    }
    useEffect(() => {getPokeCount()}, [])

    const getNthPokemon = async (n : number) => {
        return await fetch('https://pokeapi.co/api/v2/pokemon/' + n )
        .then(resp => resp.json())
    }

    const [pokeList, setPokeList] = useState<any[]>([])
    const getPokeList = async () => {
        return await fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + pokeCount)
        .then(resp => resp.json())
        .then(json => json.results)
        .then(setPokeList)
    }
    useEffect(() => {getPokeList()}, [pokeCount])

    const keys = Array.from({length : pokeCount}, (v, i) => {return {key: i}})
    // console.log(keys)
    // console.log(pokeList)

    console.log('refresh pokelist')

    return <>
        <View>
            <Text>Here will be a list of pokemons!</Text>
            <Text>{pokeCount}</Text>
        
            {/* <PokeListTile name = 'pikachu'/>
            <PokeListTile name ={'eevee'} />
            <PokeListTile name ={'charizard'} />
            <PokeListTile name ={'magicarp'} /> */}

            <FlatList
                data={pokeList}
                // data={[
                //     {key : 'Charizard'},
                //     {key : 'Pikachu'},
                //     {key : 'Eevee'},
                // ]}
                renderItem = {({item}) => {
                    return (
                        <PokeListTile name={item.name}/>
                    )
                }}
                // renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
            />
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingTop: 20,
    },
    item : {
        padding: 10,
        fontSize: 20,
        height: 50,
    }
})