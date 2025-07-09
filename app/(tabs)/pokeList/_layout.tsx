import { FavouritePokemon, SelectedPokemonProvider } from "@/context/context/context";
import { storeFavouritePokemon } from "@/storage/PokeStorage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { useContext, useState } from "react";
import { Pressable } from "react-native";

export default function layout() {
    const {favouritePokemonName, setFavouritePokemonName} = useContext(FavouritePokemon)
    const [selectedPokemonName, setSelectedPokemonName] = useState<string>('')

    return  (
        <SelectedPokemonProvider
            pokemonName={selectedPokemonName}    
            setPokemonName={setSelectedPokemonName}
        >
            <Stack
                screenOptions={{
                headerStyle: {
                    backgroundColor: 'teal',
                    },
                    headerTintColor: 'white',
                    headerTitleStyle: {
                    fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen 
                    name="index"
                    options={{
                        headerShown : false,
                    }}
                />
                
                <Stack.Screen 
                    name="stats"
                    options={{
                        presentation:'modal',
                        headerRight: (props) => {
                            return <Pressable
                                onPress={ () => {
                                    if(selectedPokemonName == favouritePokemonName) {
                                        setFavouritePokemonName('');
                                        storeFavouritePokemon('');
                                    } else {
                                        setFavouritePokemonName(selectedPokemonName);
                                        storeFavouritePokemon(selectedPokemonName);
                                    }
                                }}
                            ><Ionicons name= { (favouritePokemonName != selectedPokemonName || !favouritePokemonName) ? "star-outline" : "star"} size={32} color={'yellow'} /></Pressable>
                        }
                    }}
                />
            </Stack>
        </SelectedPokemonProvider>
    )
}