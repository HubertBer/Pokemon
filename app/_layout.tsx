import { FavouritePokemonProvider } from "@/context/context/context";
import { storeFavouritePokemon } from "@/storage/PokeStorage";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
// export const favouritePokemon = createContext<{name : string} | null>(null);

export default function RootLayout() {
  const [favouritePokemonName, setFavouritePokemonName] = useState<string>('')
  
  return (
    <FavouritePokemonProvider 
      pokemonName={favouritePokemonName} 
      setPokemonName={setFavouritePokemonName}
    >
      <Tabs
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
        <Tabs.Screen name='(tabs)/pokeList'
          options = {{
            title:'Pokemons',
            tabBarIcon: ({focused, color, size}) => {return <Ionicons name="home" size={size} color={color} />},
          }}
        />
        <Tabs.Screen
            name="(tabs)/index"
            options={{
              title : 'Favourite Pokemon',
              tabBarIcon: ({focused, color, size}) => {return <Ionicons name="heart" size={size} color={color} />},
              headerRight: (props) => {
                return <Pressable
                  onPress={ () => {
                    console.log('unliked header')
                    setFavouritePokemonName('');
                    storeFavouritePokemon('');
                  }}
                ><Ionicons name= { (favouritePokemonName == '' || !favouritePokemonName) ? "star-outline" : "star"} size={32} color={'yellow'} /></Pressable>
              }
            }}
          />
        <Tabs.Screen name='(tabs)/camera'
          options = {{
            title: 'camera',
            tabBarIcon: ({focused, color, size}) => {return <Ionicons name="camera" size={size} color={color} />}
          }}
        />
      </Tabs>
    </FavouritePokemonProvider>
  );
}
