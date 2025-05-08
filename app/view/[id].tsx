import RankCategory from "@/components/RankCategory";
import type { AlbumImages } from "@/types/album";
import { getAlbumDetails, getAlbumImages, getAlbumRankingDetails } from "@/utils/db";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewAlbumPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const db = useSQLiteContext();

	const [rankingError, setRankingError] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [imgs, setImgs] = useState<AlbumImages>();
	const [enlargedImg, setEnlargedImg] = useState<string | null>(null);

	const fetchAlbum = async () => {
		const albumDetails = await getAlbumDetails(db, Number.parseInt(id));
		if (!albumDetails) return;
		
		setName(albumDetails.name);
		
		const imgs = await getAlbumImages(db, Number.parseInt(id));
		if (!imgs) return;
		if (imgs.Rank1.length === 0 && imgs.Rank2.length === 0 && imgs.Rank3.length === 0) {
			setRankingError(true);
			return;
		};

		setImgs(imgs);
	};

	const handleRankingError = async () => {
		const albumId = Number.parseInt(id);
		const albumDetails = await getAlbumRankingDetails(db, albumId);

		router.navigate({
			pathname: "/rank",
			params: {
				albumId: albumId,
				method: albumDetails.method,
				images: JSON.stringify(albumDetails.images)
			}
		});
	};

	useEffect(() => {
		fetchAlbum();
	}, []);

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
			edges={["left", "right", "bottom"]}
		>
			<Stack.Screen
				options={{
					title: name || "Loading...",
					headerRight: () => (
						<IconButton icon="pencil" size={24} onPress={() => router.navigate(`/manage/${id}`)} />
					)
				}}
			/>

			{rankingError && (
				<View style={{ alignItems: "center", justifyContent: "center", marginTop: -50 }}>
					<MaterialIcons name="error-outline" size={72} color="black" />
					<Text variant="titleLarge" style={{ marginTop: 8 }}>Ranking is incomplete.</Text>
					<Button
						mode="contained-tonal"
						onPress={handleRankingError}
						style={{ marginTop: 16 }}
					>
						Rank Now
					</Button>
				</View>
			)}

			{imgs && (
				<ScrollView style={{ paddingTop: 24 }}>
					<Stack.Screen
						options={{
							title: name || "Loading...",
							headerRight: () => (
								<IconButton icon="pencil" size={24} onPress={() => router.navigate(`/manage/${id}`)} />
							)
						}}
					/>

					
					<View style={{ marginBottom: 24 }}>
						<RankCategory stars={3} />
						<View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
							{imgs?.Rank3.map((img) => (
								<View key={img} style={{ width: "33.3%", padding: 8 }}>
									<TouchableOpacity onPress={() => setEnlargedImg(img)}>
										<Image
											source={{ uri: img }}
											resizeMode="cover"
											style={{ width: "100%", height: 200 }}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					</View>

					<View style={{ marginBottom: 24 }}>
						<RankCategory stars={2} />
						<View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
							{imgs?.Rank2.map((img) => (
								<View key={img} style={{ width: "33.3%", padding: 8 }}>
									<TouchableOpacity onPress={() => setEnlargedImg(img)}>
										<Image
											source={{ uri: img }}
											resizeMode="cover"
											style={{ width: "100%", height: 200 }}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					</View>

					<View style={{ marginBottom: 48 }}>
						<RankCategory stars={1} />
						<View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
							{imgs?.Rank1.map((img) => (
								<View key={img} style={{ width: "33.3%", padding: 8 }}>
									<TouchableOpacity onPress={() => setEnlargedImg(img)}>
										<Image
											source={{ uri: img }}
											resizeMode="cover"
											style={{ width: "100%", height: 200 }}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					</View>
				</ScrollView>
			)}

			{enlargedImg !== null &&
				<Portal>
					<Modal visible={true} dismissable={true} onDismiss={() => setEnlargedImg(null)}>
						<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
							<Image
								source={{ uri: enlargedImg }}
								style={{ width: "100%", height: 500 }}
								resizeMode="contain"
							/>
						</View>
					</Modal>
				</Portal>
			}
		</SafeAreaView>
	);
}
