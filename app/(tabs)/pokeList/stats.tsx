import { FavouritePokemon, SelectedPokemon } from "@/context/context/context";
import { storeFavouritePokemon } from "@/storage/PokeStorage";
import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function stats() {
    const {selectedPokemonName, setSelectedPokemonName} = useContext(SelectedPokemon);
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const [pokemon, setPokemon] = useState<{
        name : string,
        image : string,
        baseHp : number,
        baseAtk : number,
    } | null>(null);

    useEffect(()=>{
        if (selectedPokemonName == '') {
            return;
        }
        fetch('https://pokeapi.co/api/v2/pokemon/' + selectedPokemonName)
            .then(resp => resp.json())
            .then(json => {
                const baseHp : number = json.stats.find((stat : any) => stat.stat.name=='hp').base_stat;
                const baseAtk : number = json.stats.find((stat : any) => stat.stat.name=='attack').base_stat;

                return {
                    name : selectedPokemonName,
                    image : json.sprites.other.home.front_default,
                    baseHp : baseHp,
                    baseAtk : baseAtk,
                }
            })
            .then(setPokemon)
    }, [selectedPokemonName])

    const pokeStats = pokemon == null 
        ? <Text>No pokemon loaded</Text>
        : <>
            <Text> Name : {pokemon.name} </Text>
            <Text> Base HP : {pokemon.baseHp} </Text>
            <Text> Base Attack : {pokemon.baseAtk} </Text>
            <Image
                source={pokemon.image}
                style={styles.pokeSprite}
            />
            <Pressable onPress={() => {
                if (favouritePokemonName == pokemon.name) {
                    setFavouritePokemonName('')
                    storeFavouritePokemon('');
                } else {
                    setFavouritePokemonName(pokemon.name.toLowerCase())
                    storeFavouritePokemon(pokemon.name.toLowerCase());
                }
            }}>
                <Image
                    style = {styles.heart}
                    source = {pokemon.name == favouritePokemonName ? require('@/assets/images/heart-filled.svg') : require('@/assets/images/heart-empty.svg')}
                />
            </Pressable>
        </>
    return <View style={styles.stats}>
        {pokeStats}    
    </View>
}

const styles = StyleSheet.create({
    stats : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    pokeSprite : {
        width : 100,
        height : 100,
    },
    heart : {
        width : 100,
        height : 100,
    },
});