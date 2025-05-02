import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function MyAlbumsPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "My Albums" }} />
			<Text>index</Text>
		</View>
	);
}
