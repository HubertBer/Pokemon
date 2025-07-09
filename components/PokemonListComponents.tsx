import { FavouritePokemon, VisibleTiles } from "@/context/context/context";
import { storeFavouritePokemon } from "@/storage/PokeStorage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

export function PokeListTile(
    props: {
        name: string,
        setSelectedPokemonName: (name: string) => void,
        index: number
    }) {
    const {visibleTiles} = useContext(VisibleTiles)
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const pokeUrl = 'https://pokeapi.co/api/v2/pokemon/' + props.name
    const [pokeJson, setPokeJson] = useState<{sprites : {front_default : string}, name : string} | null>(null);
    const [isFavourite, setIsFavourite] = useState<boolean>(false)

    const getPokeJson = async () => {
        return await fetch(pokeUrl)
            .then(response => response.json())
            .then(setPokeJson)
    }
    useEffect(() => {getPokeJson()}, [])

    console.log('refresh pokeTile')

    const randomRange = (x : number, y : number) => {
        return Math.random() * (y - x) + x
    }
    const pokePosX = useSharedValue(randomRange(-400, 400))
    const pokePosY = useSharedValue(randomRange(-400, 400))
    const pokeRotation = useSharedValue('360deg')
    const pokeScale = useSharedValue(1)

    const pokeStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: pokePosX.value},
                {translateY: pokePosY.value},
                {rotateZ: pokeRotation.value},
                {scale: pokeScale.value}
            ],
            width: 100,
            height: 100,
        }
    })

    useEffect(() => {
        // if (visibleTiles.has(props.index)) {
            pokePosX.value = randomRange(-400, 400)
            pokePosY.value = randomRange(-400, 400)

            pokePosX.value = withTiming(0, {duration : randomRange(700, 1700)})
            pokePosY.value = withTiming(0, {duration : randomRange(700, 1700)})
        // }
    }, [visibleTiles])
        
    useEffect(() => {
        if (favouritePokemonName && favouritePokemonName.toLowerCase() == props.name.toLowerCase()) {
            setIsFavourite(true)
        } else {
            setIsFavourite(false)
        }
    }, [favouritePokemonName])

    useEffect(() => {
        if (isFavourite) {
            pokeRotation.value = '360deg'

            const animTime = randomRange(800, 1000)
            const halfTime1 = randomRange(300, animTime - 300)
            const halfTime2 = animTime - halfTime1

            pokeRotation.value = withTiming('0deg', {duration: animTime})
            pokeScale.value = withSequence(
                withTiming(randomRange(2, 3), {duration : halfTime1}),
                withTiming(1, {duration : halfTime2})
            )
            pokePosY.value = withSequence(
                withTiming(randomRange(-50, -100), {duration: halfTime1}),
                withTiming(0, {duration: halfTime2}),
            )
        }
    }, [isFavourite])


    if (pokeJson) {
        return <View style={styles.pokeTile}>
        <Text> Poke name : {props.name} </Text>
        <Pressable
            onPress={() => {
                props.setSelectedPokemonName(props.name.toLowerCase())
                console.log('set selected pokemon name to: ' + props.name.toLowerCase())
                router.navigate('/(tabs)/pokeList/stats')
            }}
        >
            <Animated.Image
                style = {pokeStyle}
                source = {{ uri: pokeJson.sprites.front_default }}
            />
        </Pressable>


        <Pressable onPress={() => {
            console.log(props.name + ' heart clicked');
            if (favouritePokemonName == props.name) {
                setFavouritePokemonName('')
                storeFavouritePokemon('');
            } else {
                setFavouritePokemonName(props.name.toLowerCase())
                storeFavouritePokemon(props.name.toLowerCase());
            }
        }}>
            <Image
                style = {styles.heart}
                source = {props.name == favouritePokemonName ? require('@/assets/images/heart-filled.svg') : require('@/assets/images/heart-empty.svg')}
            />
        </Pressable>
    </View>
    }
    return <></>
    // return (<View>
    //     <Text>{props.name} is loading ...</Text>
    // </View>);
}

const styles = StyleSheet.create({
    pokeTile : {
        height:100,
        // justifyContent : 'center',
        // alignItems : 'center',
        direction :'ltr',
        flexDirection: 'row',
    },
    pokeSprite : {
        width : 100,
        height : 100,
        flex : 1
    },
    heart : {
        width : 100,
        height : 100,
        flex: 1,
        alignSelf: 'flex-end',
    },
}) 