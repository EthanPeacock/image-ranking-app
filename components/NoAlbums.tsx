import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function NoAlbums() {
	return (
		<View style={{ alignItems: "center", justifyContent: "center" }}>
			<Entypo name="images" size={80} color="gray" />
			<Text variant="titleLarge" style={{ marginTop: 10 }}>
				No Albums
			</Text>
		</View>
	);
}
