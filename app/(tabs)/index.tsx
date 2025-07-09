import { FavouritePokemon } from '@/context/context/context';
import { storeFavouritePokemon } from '@/storage/PokeStorage';
import { Image } from 'expo-image';
import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function favourite_pokemon() {  
    
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const [favouritePokemonImageSrc, setFavouritePokemonImageSrc] = useState<string | null>(null)
    const [inputName, setInputName] = useState('')

    const getFavouritePokemonSprite = async () => {
        if (favouritePokemonName === '' || !favouritePokemonName) {
            setFavouritePokemonImageSrc(null)
            console.log('no favourite pokemon :(')
            return
        }
        fetch('https://pokeapi.co/api/v2/pokemon/' + favouritePokemonName)
        .then( response => response.json())
        .then( json => {
            return json.sprites.other.home.front_default
        }).then(setFavouritePokemonImageSrc)
    }

    useEffect(() => {getFavouritePokemonSprite()}, [favouritePokemonName])

    const onNewFavouritePokemon = () => {
        const pokeName = inputName
        setFavouritePokemonName(pokeName.toLowerCase());
        storeFavouritePokemon(pokeName.toLowerCase());
    }

    const unfovouriteButton = (favouritePokemonName === '' || !favouritePokemonName)
        ? <></> 
        : <Pressable onPress={() => {
                storeFavouritePokemon('')
                setFavouritePokemonName('') 
            }}>
                <Image
                    style = {styles.heart}
                    source = { require('@/assets/images/heart-filled.svg')}
                />
            </Pressable>

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
            onBlur={onNewFavouritePokemon}
            onChangeText={setInputName}
            value={inputName}
        />
        {/* <Button 
            title='Change the favourite pokemon'
            onPress={onNewFavouritePokemon}
        /> */}
        
        <Text>
            {favouritePokemonName ? 'My favourite pokemon is the ' + favouritePokemonName : 'You don\'t yet have a favourite pokemon!\n Pick one from the list or type it\'s name here'}.
        </Text>
        <Image
            style = {{
                width : 100,
                height : 100,
            }}
            source = {favouritePokemonImageSrc ? { uri: favouritePokemonImageSrc } : require('@/assets/images/question-mark.svg')}
            // source = {require('@/assets/images/question-mark.svg')}
        ></Image>
        {unfovouriteButton}
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
    },
    heart : {
        height:100,
        width:100,
    },
});