import { SelectedPokemonProvider } from "@/context/context/context";
import { Stack } from "expo-router";

export default function layout() {
    return  <SelectedPokemonProvider>
        <Stack>
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
                }}
            />
        </Stack>
    </SelectedPokemonProvider>;
}