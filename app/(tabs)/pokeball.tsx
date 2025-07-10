import { FavouritePokemon } from "@/context/context/context";
import { useContext, useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { clamp, useAnimatedStyle, useSharedValue, withDecay, withSequence, withTiming } from "react-native-reanimated";

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
    const pokeballScale = useSharedValue(1);
    const pokeballRotation = useSharedValue('0deg');
    
    const pokeballStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: pokeballX.value},
                {translateY: pokeballY.value},
                {rotate: pokeballRotation.value},
                {scale: pokeballScale.value},
            ]
        }
    })
    
    const pokemonScale = useSharedValue(1);
    const pokemonX = useSharedValue(0)
    const pokemonY = useSharedValue(0)

    const pokemonStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX : pokemonX.value},
                {translateY : pokemonY.value},
                {scale: pokemonScale.value},
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

    const randomRange = (x : number, y : number) => {
        'worklet'
        return Math.random() * (y - x) + x;
    }

    const dist = (x0 : number, y0 : number, x1 : number, y1 : number) => {
        'worklet'
        return Math.sqrt((x0 - x1)*(x0 - x1) + (y0 - y1) * (y0 - y1))
    }

    const panGesture = Gesture.Pan()
        .minDistance(1)
        .onBegin(() => {
            // console.log(pokeballY.value)
            // console.log(pokemonY.value)
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
            pokeballX.value = withDecay({velocity: clamp(e.velocityX, -MAX_POKEBALL_SPEED, MAX_POKEBALL_SPEED)}, () => {
                // This probably won't work on different devices need some kind of absolute position,
                // maybe make image style absolute
                const ballPokeDist = dist(pokeballX.value, pokeballY.value +80, pokemonX.value, pokemonY.value)
                const ballTravelDist = dist(prevPokeballX.value, prevPokeballY.value, pokeballX.value, pokeballY.value)
                if(ballPokeDist < 50 && ballTravelDist > 100) {
                    // console.log('hit')
                    pokemonScale.value=withSequence(
                        withTiming(2),
                        withTiming(0, {}, () => {
                            pokemonX.value = randomRange(-100, 100)
                            pokemonY.value = randomRange(-200, 100)
                        }),
                        withTiming(1),
                    )

                    const time = 200
                    pokeballScale.value = withSequence(
                        withTiming(1.4, {duration: time}),
                        withTiming(0.7, {duration: time}),
                        withTiming(1, {duration: time}),
                    )

                    pokeballRotation.value = withSequence(
                        withTiming('70deg', {duration: time}),
                        withTiming('-70deg', {duration: time}),
                        withTiming('0deg', {duration: time}),
                    )
                }

                // console.log(pokeballX.value, pokeballY.value, pokemonX.value, pokemonY.value)
            })
            pokeballY.value = withDecay({velocity: clamp(e.velocityY, -MAX_POKEBALL_SPEED, MAX_POKEBALL_SPEED)})
        })
        .runOnJS(true);



    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Animated.Image style={[styles.pokemon, pokemonStyle]} source={favouritePokemonImageSrc ? {uri: favouritePokemonImageSrc} : require('@/assets/images/icon.png')}/>
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