import InfiniteScrollPokeList from "@/components/infinite_scroll";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hey checkout the pokemons app!</Text>
      <InfiniteScrollPokeList></InfiniteScrollPokeList>
    </View>
  );
}
