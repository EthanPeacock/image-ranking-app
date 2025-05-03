import { useRouter } from "expo-router";
import { View } from "react-native";
import { Card, Text, IconButton, useTheme, TouchableRipple } from "react-native-paper";

export default function AlbumCard() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Card mode="outlined" style={{ marginBottom: 20 }}>
			<TouchableRipple onPress={() => router.navigate("/view")}>
				<>
					<Card.Cover source={{ uri: "https://picsum.photos/700" }} />
					<Card.Content style={{ marginTop: 5 }}>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center"
							}}
						>
							<Text variant="titleLarge" numberOfLines={1} style={{ width: "80%" }}>
								Chchc jviviv ugig uguguvi vuvuvjvhv hvu vuvugu vugughv uva
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
							album description will certinaly go here for sure for sure
						</Text>
						<Text variant="bodySmall" style={{ marginBottom: 15 }}>
							15 Images
						</Text>
					</Card.Content>
				</>
			</TouchableRipple>
		</Card>
	);
}
