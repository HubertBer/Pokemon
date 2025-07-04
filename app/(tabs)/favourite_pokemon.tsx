import { FavouritePokemon } from '@/context/context/context';
import { storeFavouritePokemon } from '@/storage/PokeStorage';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function favourite_pokemon() {  
    
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    // console.log(favouritePokemon)

    const { fp } =  useLocalSearchParams()
    console.log(fp)

    if (fp == '') {
        console.log('empty')        
    }

    // const [favouritePokemonName, setFavouritePokemonName] = useState('')
    const [favouritePokemonImageSrc, setFavouritePokemonImageSrc] = useState('')

    const getFavouritePokemonSprite = async () => {
        fetch('https://pokeapi.co/api/v2/pokemon/' + favouritePokemonName)
        .then( response => response.json())
        .then( json => {
            return json.sprites.other.home.front_default
        }).then(setFavouritePokemonImageSrc)
    }

    useEffect(() => {getFavouritePokemonSprite()}, [favouritePokemonName])

    const onNewFavouritePokemon = () => {
        const pokeName = inputName
        setFavouritePokemonName(pokeName);
        storeFavouritePokemon(pokeName);
    }

    const [inputName, setInputName] = useState('')

    console.log('fav refresh');

    return <>
    <View 
    style={{
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
    }}>
        <TextInput
            style={styles.input}
            onSubmitEditing={onNewFavouritePokemon}
            onChangeText={setInputName}
            value={inputName}
        />
        {/* <Button 
            title='Change the favourite pokemon'
            onPress={onNewFavouritePokemon}
        /> */}
        
        <Text>
            My favourite pokemon is the {favouritePokemonName}.
        </Text>
        <Image
            style = {{
                width : 100,
                height : 100,
            }}
            source = {{ uri: favouritePokemonImageSrc }}
        ></Image>
    </View>
    </>
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 4,
        padding: 5,
        minWidth: 100,
    }
});