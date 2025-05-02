import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function RankingPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Rank Images" }} />
			<Text>rank images page</Text>
		</View>
	);
}
