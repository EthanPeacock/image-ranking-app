import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function CreateAlbumPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Create Album" }} />
			<Text>create album page</Text>
		</View>
	);
}
