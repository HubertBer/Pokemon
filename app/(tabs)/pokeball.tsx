import { FavouritePokemon } from "@/context/context/context";
import { useContext, useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { clamp, useAnimatedStyle, useSharedValue, withDecay } from "react-native-reanimated";

const {width, height} = Dimensions.get('screen')
const MAX_POKEBALL_SPEED = 900


export default function Pokeball() {

    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const [favouritePokemonImageSrc, setFavouritePokemonImageSrc] = useState<string | null>(null)

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

    const [pokeballSprite, setPokeballSprite] = useState<string | null>(null)
    useEffect(()=>{
        fetch('https://pokeapi.co/api/v2/item/master-ball')
            .then(resp => resp.json())
            .then(json => json.sprites.default)
            .then(setPokeballSprite)
    }, [])

    const pokeballX = useSharedValue(110);
    const pokeballY = useSharedValue(110);
    const prevPokeballX = useSharedValue(110);
    const prevPokeballY = useSharedValue(110);

    const pokeballStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: pokeballX.value},
                {translateY: pokeballY.value},
            ]
        }
    })

    const pokemonX = useSharedValue(0)
    const pokemonY = useSharedValue(0)

    const pokemonStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX : pokemonX.value},
                {translateY : pokemonY.value},
            ]
        }
    })    

    // useEffect(() => {
    //     pokeballY.value = withRepeat(
    //         withSequence(
    //             withTiming(500),
    //             withTiming(0)
    //         ),
    //         Infinity
    //     )
    // }, [])

    const panGesture = Gesture.Pan()
        .minDistance(1)
        .onBegin(() => {
            console.log(pokeballY.value)
            console.log(pokemonY.value)
            prevPokeballX.set(pokeballX.value)
            prevPokeballY.set(pokeballY.value)
        })
        .onUpdate((e) => {
            const maxX = width / 2 - 50
            const maxY = height / 2 - 50
            
            pokeballX.set(clamp(prevPokeballX.value + e.translationX, -maxX, maxX))
            pokeballY.set(clamp(prevPokeballY.value + e.translationY, -maxY, maxY))
        })
        .onEnd((e) => {
            prevPokeballX.set(pokeballX.value)
            prevPokeballY.set(pokeballY.value)
            pokeballX.value = withDecay({velocity: clamp(e.velocityX, -MAX_POKEBALL_SPEED, MAX_POKEBALL_SPEED)})
            pokeballY.value = withDecay({velocity: clamp(e.velocityY, -MAX_POKEBALL_SPEED, MAX_POKEBALL_SPEED)})
        })
        .runOnJS(true);

    // const flingGesture = Gesture.Fling()
    //     // .blocksExternalGesture(panGesture)
    //     .direction(Directions.UP)
    //     .onStart((e) => {
    //         pokeballY.value = withDecay({velocity: -800})
    //     })
    //     .runOnJS(true)



    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Animated.Image style={styles.pokemon} source={favouritePokemonImageSrc ? {uri: favouritePokemonImageSrc} : require('@/assets/images/icon.png')}/>
                <GestureDetector gesture={panGesture}>
                    {/* <Animated.View style={[styles.pokeball, pokeballStyle]}> */}
                        <Animated.Image
                            source = {pokeballSprite ? {uri: pokeballSprite} : require('@/assets/images/icon.png')}
                            style = {[styles.pokeball, pokeballStyle]}
                        />
                    {/* </Animated.View> */}
                </GestureDetector>

            </View>
            <Button title='RESET POKEBALL' onPress={()=>{
                pokeballX.set(0)
                pokeballY.set(0)
                prevPokeballX.set(0)
                prevPokeballX.set(0)
            }}/>
        </View>
    )
}

const styles = StyleSheet.create({
    pokeball: {
        width: 100,
        height: 100,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pokemon : {
        width: 100,
        height: 100,
    }
})