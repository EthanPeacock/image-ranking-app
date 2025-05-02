import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, FAB, Text } from "react-native-paper";
import NoAlbums from "@/components/NoAlbums";

export default function MyAlbumsPage() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
			edges={['left', 'right', 'bottom']}
		>
			<Stack.Screen options={{ title: "My Albums" }} />
			
			{/* <NoAlbums /> */}
			
			<View style={{ flex: 1, width: "90%" }}>
				<Card mode="outlined" style={{ marginTop: 20 }}>
					<Card.Cover source={{ uri: "https://picsum.photos/700" }} />
					<Card.Content style={{ marginTop: 10 }}>
						<View style={{ marginBottom: 8 }}>
							<Text variant="titleLarge">album name</Text>
							{/* the button to manage album here... */}
						</View>
						<Text variant="titleSmall" style={{ marginBottom: 10 }} numberOfLines={2}>album description will certinaly go here for sure for sure</Text>
						<Text variant="bodySmall">15 Images</Text>
					</Card.Content>
				</Card>
			</View>

			<FAB
				icon="plus"
				style={{ position: "absolute", bottom: insets.bottom + 20, right: 32 }}
				onPress={() => console.log("hello")}
			/>
		</SafeAreaView>
	);
}
