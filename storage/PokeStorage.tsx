import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeFavouritePokemon(pokemonName : string){
    try {
        await AsyncStorage.setItem('favouritePokemon', pokemonName)
    } catch (e) {
        console.log('ERROR in store favourite pokemon: ' + e);
    }
}

export async function getFavouritePokemon(){
    try {
        return await AsyncStorage.getItem('favouritePokemon')
    } catch (e) {
        console.log('ERROR in get favourite pokemon: ' + e)
        return '';
    }
}