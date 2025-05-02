import { Stack } from "expo-router";
import { Text, View } from "react-native";

export default function ManageAlbumPage() {
	return (
		<View>
			<Stack.Screen options={{ title: "Manage Album" }} />
			<Text>manage album page</Text>
		</View>
	);
}
