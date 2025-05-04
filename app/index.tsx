import { Stack, useFocusEffect, useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FAB } from "react-native-paper";
import NoAlbums from "@/components/NoAlbums";
import AlbumCard from "@/components/AlbumCard";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import type { AlbumDetails } from "@/types/album";
import { getAlbums } from "@/utils/db";

export default function MyAlbumsPage() {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const db = useSQLiteContext();

	const [albums, setAlbums] = useState<AlbumDetails[]>([]);

	useFocusEffect(
		useCallback(() => {
			const getUserAlbums = async () => {
				const albums = await getAlbums(db);
				setAlbums(albums);
			};

			getUserAlbums();
		}, [])
	);

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
			edges={["left", "right", "bottom"]}
		>
			<Stack.Screen options={{ title: "My Albums" }} />

			{albums.length === 0 && <NoAlbums />}
			{albums.length > 0 && (
				<ScrollView style={{ flex: 1, width: "90%", marginTop: 20 }}>
					{albums.map((album) => (
						<AlbumCard key={album.id} album={album} />
					))}
				</ScrollView>
			)}

			<FAB
				icon="plus"
				style={{ position: "absolute", bottom: insets.bottom + 20, right: "5%" }}
				onPress={() => router.navigate("/create")}
			/>
		</SafeAreaView>
	);
}
