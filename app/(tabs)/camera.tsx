import { FavouritePokemon } from "@/context/context/context";
import { Image } from "expo-image";
import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import {
    Camera,
    runAsync,
    useCameraDevice,
    useCameraFormat,
    useCameraPermission, useFrameProcessor
} from "react-native-vision-camera";
import {
    FaceDetectionOptions,
    useFaceDetector
} from 'react-native-vision-camera-face-detector';
import { useRunOnJS } from "react-native-worklets-core";

import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const PHONE_WIDTH = Dimensions.get('window').width;
const PHONE_HEIGHT = Dimensions.get('window').height;

export default function CameraTab() {
    const camera = useRef<Camera>(null)

    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon);
    const [favouritePokemonImageSrc, setFavouritePokemonImageSrc] = useState<string | null>(null)
    
    const getFavouritePokemonSprite = async () => {
        if (favouritePokemonName === '') {
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
    const pokeSpriteUrl = favouritePokemonImageSrc ? {uri: favouritePokemonImageSrc}: require('@/assets/images/icon.png');


    const { hasPermission, requestPermission } = useCameraPermission()

    const top = useSharedValue<number>(0);
    const left = useSharedValue<number>(0);
    const headWidth = useSharedValue<number>(100);
    const headHeight = useSharedValue<number>(100);
    const animatedStyles = useAnimatedStyle(() => {
        return {
            position : 'absolute',
            transform : [
                {translateX : (PHONE_WIDTH - left.value) },
                {translateY : top.value},
            ],
            width : headWidth.value,
            height : headHeight.value,
        }
    });

    const {
        width,
        height
    } = useWindowDimensions()
    const device = useCameraDevice('front');

    const updatePosition = (x : number, y : number, hx : number, hy : number) => {
        left.value = x
        top.value = y
        headWidth.value = hx
        headHeight.value = hy
    }

    const updatePosJS = useRunOnJS(updatePosition, [])

    const faceDetectionOptions = useRef<FaceDetectionOptions>( {
        performanceMode: 'fast',
        classificationMode: 'all',
        contourMode: 'all',
        landmarkMode: 'all',
        windowWidth: width,
        windowHeight: height
        
    } ).current

    const { detectFaces } = useFaceDetector( faceDetectionOptions )
    
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        
        runAsync(frame, () => {
            'worklet'
            const faces = detectFaces(frame)

            if(faces.length > 0) {
                const scaleX = faces[0].bounds.height / 250
                const scaleY = faces[0].bounds.width / 200
                var x : number = 0
                var y : number = 0
                if ( faces[0].landmarks != undefined ) {
                    x = faces[0].landmarks?.LEFT_EAR.x - 50 * scaleX
                    y = faces[0].landmarks?.LEFT_EAR.y + 30 * scaleY
                }
                updatePosJS(x, y, faces[0].bounds.width, faces[0].bounds.height)
            }
        })
    }, [])

    const format = useCameraFormat(device, [
    { 
        videoResolution: { 
            width: 720,
            height : 480
        },

        videoHdr : false,
    }
    ])

    if (!hasPermission) {
        requestPermission();
        return <View>
            <Text> You need to provide camera permission to use the camera!</Text>
        </View>
    }

    if ( !device ) {
        return <View>
            <Text>
                No back camera device detected. 
            </Text>
        </View>;
    }

    const takeAPhoto = async () => {
        console.log('take a photo')
        if (camera) {
            const file = await camera.current?.takePhoto()
            await CameraRoll.save(`file://${file?.path }`, {
            type: 'photo',
            })
        }
    }

    return (
        <>
            <Camera 
                device = {device}
                style = {StyleSheet.absoluteFill}
                isActive = {true}
                frameProcessor = {frameProcessor}
                ref = {camera}
                photo = {true}
            >
            </Camera>
            <Animated.Image
                style= {animatedStyles}
                source = { pokeSpriteUrl }
            ></Animated.Image>
            <Pressable 
                onPress={takeAPhoto}
                style = {{
                    alignItems : "center",
                    flex: 1,
                    justifyContent: 'flex-end',
                }}
            >
                <Image 
                    source={require("@/assets/images/heart-filled.svg")}
                    style={styles.heart}
                />
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    heart : {
        width:100,
        height:100,
    }
})