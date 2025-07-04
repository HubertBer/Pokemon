import { FavouritePokemon } from "@/context/context/context";
import { storeFavouritePokemon } from "@/storage/PokeStorage";
import { Image } from "expo-image";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function PokeListTile(props : {name : string }) {
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + props.name
    const [pokeJson, setPokeJson] = useState<{sprites : {front_default : string}, name : string} | null>(null);
    const getPokeJson = async () => {
        return await fetch(pokeUrl)
            .then(response => response.json())
            // .then(JSON.stringify)
            .then(setPokeJson)
    }
    useEffect(() => {getPokeJson()}, [])

    console.log('refresh pokeTile')

    if (pokeJson) {
        return <View style={styles.pokeTile}>
        {/* <Text>{pokeUrl}</Text>
        <Text>{pokeJson}</Text> */}
        <Text> Poke name : {props.name} </Text>
        {/* <Image
            style = {styles.pokeSprite}
            source = {
                { uri: JSON.parse(pokeJson).sprites.front_default }}
        ></Image> */}
        <Pressable onPress={() => {
            console.log(props.name + ' clicked');
            setFavouritePokemonName(props.name)
            storeFavouritePokemon(props.name);
        }}>
            <Image
                style = {styles.pokeSprite}
                source = {
                    { uri: pokeJson.sprites.front_default }}
            ></Image>
        </Pressable>
        {/* <Pressable>
            <Image style = {styles.heart} source = {{uri : ''}}></Image>
        </Pressable> */}
        {/* <Button title='Favourite'></Button> */}
    </View>
    }
    return (<View>
        <Text>{props.name} is loading ...</Text>
    </View>);
}

const styles = StyleSheet.create({
    pokeTile : {
        height:100,
        justifyContent : 'center',
        alignItems : 'center',
        direction :'ltr',
        flexDirection: 'row',
    },
    pokeSprite : {
        width : 100,
        height : 100,
    },
    heart : {
        width : 100,
        height : 100,
    },
}) 