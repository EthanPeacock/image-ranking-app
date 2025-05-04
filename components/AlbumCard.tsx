import type { AlbumDetails } from "@/types/album";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Card, Text, IconButton, useTheme, TouchableRipple } from "react-native-paper";

export default function AlbumCard({ album }: { album: AlbumDetails }) {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Card mode="outlined" style={{ marginBottom: 20 }}>
			<TouchableRipple onPress={() => router.navigate("/view")}>
				<>
					<Card.Cover source={{
						uri: album.thumbnail || require("@/assets/img-placeholder.jpg")
					}} />
					<Card.Content style={{ marginTop: 5 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Text variant="titleLarge" numberOfLines={1} style={{ width: "80%" }}>
								{album.name}
							</Text>
							<IconButton
								icon="circle-edit-outline"
								iconColor={theme.colors.primary}
								size={20}
								onPress={() => router.navigate("/manage")}
								style={{ marginRight: -5 }}
							/>
						</View>
						<Text variant="titleSmall" style={{ marginBottom: 10 }} numberOfLines={2}>
							{album.description}
						</Text>
						<Text variant="bodySmall" style={{ marginBottom: 15 }}>
							{album.imgCount} Images
						</Text>
					</Card.Content>
				</>
			</TouchableRipple>
		</Card>
	);
}
