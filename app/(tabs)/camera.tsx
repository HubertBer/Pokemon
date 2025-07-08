import { useRef } from "react";
import { Dimensions, StyleSheet, Text, useWindowDimensions, View } from "react-native";
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

const PHONE_WIDTH = Dimensions.get('window').width;
const PHONE_HEIGHT = Dimensions.get('window').height;

export default function CameraTab() {
    const { hasPermission, requestPermission } = useCameraPermission()
    // const [faceStyle, setFaceStyle] = useState<StyleProp<ImageStyle>>({
    //     position : 'absolute',
    //     top : 100,
    //     left : 100,
    //     width:100,
    //     height:100
    // });
    const top = useSharedValue<number>(0);
    const left = useSharedValue<number>(0);
    const animatedStyles = useAnimatedStyle(() => {
        return {
            position : 'absolute',
            transform : [
                {translateX : (PHONE_WIDTH - left.value) },
                {translateY : top.value},
            ],
            // top : top.value,
            // left : left.value,
            width : 100,
            height : 100,
            backgroundColor : 'red',
        }
    });

    // useEffect(() => {
    //     top.value = withTiming(200, {duration:1000})
    // }, [])

    const {
        width,
        height
    } = useWindowDimensions()
    const device = useCameraDevice('front');

    const updatePosition = (x : number, y : number) => {
        left.value = x
        top.value = y
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
    
    
    // console.log('camera')
    // console.log(faceStyle)

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        
        runAsync(frame, () => {
            'worklet'
            // console.log('in worklet')
            const faces = detectFaces(frame)

            if(faces.length > 0) {
                // runOnJS(updatePosition)(faces[0].bounds.x, faces[0].bounds.y)
                updatePosJS(faces[0].bounds.x, faces[0].bounds.y)
                // updatePosJS(20, 20)
                // left.value = faces[0].bounds.x
                // top.value = faces[0].bounds.y
                // console.log('if')
                // console.log(faces[0].bounds)
                // console.log(left.value)
                // console.log(top.value)
            }
        })
        
        



        // console.log(left.value)
        // console.log(top.value)
    
        // console.log()
        // console.log()
        // console.log()
    
        // console.log(animatedStyles)
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

    return (
        <>
            <Camera 
                device={device}
                style={StyleSheet.absoluteFill}
                isActive={true}
                frameProcessor={frameProcessor}
                // format = {format}
                // fps={12}
            >
            </Camera>
            {/* <Image
                style = {faceStyle}
                source = { require('@/assets/images/heart-filled.svg')}
            //     // contentPosition={screenX : 100, screenY : 100}
            // /> */}
            <Animated.View style={animatedStyles}/>
            {/* <Animated.Image
                style= {animatedStyles}
                source = { require('@/assets/images/icon.png')}
            ></Animated.Image> */}
        </>
    );
}

const styles = StyleSheet.create({
    heart : {
        position : 'absolute',
        top : 100,
        left : 100,
        width:100,
        height:100
    }
})