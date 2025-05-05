import RankCategory from "@/components/RankCategory";
import { getAlbumDetails } from "@/utils/db";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Portal, TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewAlbumPage() {
	const CATEGORIES = [3, 2, 1];

	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const db = useSQLiteContext();

	const [name, setName] = useState<string>();
	const [img, setImg] = useState<string | null>(null);

	// temp
	const placeholderImage = require("@/assets/img-placeholder.jpg");

	const fetchAlbum = async () => {
		const albumDetails = await getAlbumDetails(db, Number.parseInt(id));
		if (!albumDetails) return;

		setName(albumDetails.name);
	};

	useEffect(() => {
		fetchAlbum();
	}, []);

	return (
		<SafeAreaView
			style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
			edges={["left", "right", "bottom"]}
		>
			<ScrollView style={{ paddingTop: 24 }}>
				<Stack.Screen
					options={{
						title: name || "Loading...",
						headerRight: () => (
							<IconButton icon="pencil" size={24} onPress={() => router.navigate(`/manage/${id}`)} />
						)
					}}
				/>

				{CATEGORIES.map((category) => (
					<View key={category} style={{ marginBottom: 24 }}>
						<RankCategory stars={category} />
						<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
							<View style={{ width: "33.3%", padding: 8 }}>
								<TouchableOpacity onPress={() => setImg("test")}>
									<Image
										source={placeholderImage}
										resizeMode="cover"
										style={{ width: "100%", height: 200 }}
									/>
								</TouchableOpacity>
							</View>
							<View style={{ width: "33.3%", padding: 8 }}>
								<TouchableOpacity onPress={() => setImg("test")}>
									<Image
										source={placeholderImage}
										resizeMode="cover"
										style={{ width: "100%", height: 200 }}
									/>
								</TouchableOpacity>
							</View>
							<View style={{ width: "33.3%", padding: 8 }}>
								<TouchableOpacity onPress={() => setImg("test")}>
									<Image
										source={placeholderImage}
										resizeMode="cover"
										style={{ width: "100%", height: 200 }}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				))}
			</ScrollView>

			<Portal>
				<Modal visible={img !== null} dismissable={true} onDismiss={() => setImg(null)}>
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
						<Image source={placeholderImage} resizeMode="contain" />
					</View>
				</Modal>
			</Portal>
		</SafeAreaView>
	);
}
