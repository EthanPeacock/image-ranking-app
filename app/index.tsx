import { Stack, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FAB } from "react-native-paper";
import NoAlbums from "@/components/NoAlbums";
import AlbumCard from "@/components/AlbumCard";

export default function MyAlbumsPage() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
			edges={["left", "right", "bottom"]}
		>
			<Stack.Screen options={{ title: "My Albums" }} />

			{/* <NoAlbums /> */}

			<ScrollView style={{ flex: 1, width: "90%", marginTop: 20 }}>
				<AlbumCard />
				<AlbumCard />
				<AlbumCard />
				<AlbumCard />
			</ScrollView>

			<FAB
				icon="plus"
				style={{ position: "absolute", bottom: insets.bottom + 20, right: "5%" }}
				onPress={() => router.navigate("/create")}
			/>
		</SafeAreaView>
	);
}
