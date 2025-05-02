import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ViewAlbumPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Album Name Here" }} />
			<Text>view album page</Text>
		</View>
	);
}
