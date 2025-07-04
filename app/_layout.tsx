import { Tabs } from "expo-router";
import { createContext } from "react";

export default function RootLayout() {
  const favouritePokemon = createContext<{name : string} | null>(null);
  

  return <Tabs>
    {/* <Tabs.Screen name="(tabs)/favourite_pokemon" 
      options = {{
        title:'Favourite Pokemon',
      }}
    /> */}
    <Tabs.Screen name="(tabs)/index" options = {{title:'Home'}}/>
    <Tabs.Screen name='(tabs)/pokelist' options = {{title:'Pokemons'}}/>
    <Tabs.Screen
        // Name of the dynamic route.
        name="(tabs)/favourite_pokemon"
        options={{
          title : 'Favourite Pokemon'
        }}
      />
  </Tabs>;
}
