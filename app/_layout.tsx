import { FavouritePokemonProvider } from "@/context/context/context";
import { Tabs } from "expo-router";
import { useState } from "react";

// export const favouritePokemon = createContext<{name : string} | null>(null);

export default function RootLayout() {
  const [favouritePokemonName, setFavouritePokemonName] = useState<string | null>(null)

  return (
    <FavouritePokemonProvider>
      <Tabs>
        <Tabs.Screen name="(tabs)/index" options = {{title:'Home'}}/>
        <Tabs.Screen name='(tabs)/pokeList'
          options = {{
            title:'Pokemons' 
          }}
        />
        <Tabs.Screen
            name="(tabs)/favourite_pokemon"
            options={{
              title : 'Favourite Pokemon'
            }}
          />
        <Tabs.Screen name='(tabs)/camera'
          options = {{
            title: 'camera',
          }}
        />
      </Tabs>
    </FavouritePokemonProvider>
  );
}
