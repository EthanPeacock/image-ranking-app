import Entypo from "@expo/vector-icons/Entypo";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
	Button,
	RadioButton,
	Text,
	TextInput,
	TouchableRipple,
	useTheme
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ErrorPopup from "@/components/ErrorPopup";
import { createAlbum } from "@/utils/db";
import { useSQLiteContext } from "expo-sqlite";
import type { SelectedImage } from "@/types/album";

export default function CreateAlbumPage() {
	const NAME_LENGTH = 50;
	const DESCRIPTION_LENGTH = 100;

	const theme = useTheme();
	const router = useRouter();
	const db = useSQLiteContext();

	const [error, setError] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [description, setDescription] = useState<string>();
	const [images, setImages] = useState<SelectedImage[]>([]);
	const [method, setMethod] = useState<"similarity" | "metadata">("similarity");

	const selectImages = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			aspect: [4, 3],
			allowsMultipleSelection: true
		});

		if (!result.canceled) {
			const selectedImages = result.assets.map((asset) => ({
				filename: asset.fileName || "unknown",
				path: asset.uri
			}));

			setImages(selectedImages);
		}
	};

	const handleSubmit = async () => {
		if (!name || !description || images.length === 0) {
			setError(true);
			return;
		}

		const created = await createAlbum(db, { name, description, images, method });
		if (!created) {
			setError(true);
			return;
		}

		setError(false);
		router.replace({
			pathname: "/rank",
			params: {
				albumId: created.albumId,
				method: method,
				images: JSON.stringify(created.imgPaths)
			}
		});
	};

	return (
		<View style={{ padding: 24, flex: 1 }}>
			<Stack.Screen options={{ title: "Create Album" }} />

			{error && <ErrorPopup message="Ensure all fields are provided." />}

			<View style={{ marginBottom: 24 }}>
				<Text variant="titleLarge" style={{ marginBottom: 12 }}>
					Details
				</Text>
				<TextInput
					mode="outlined"
					label="Album Name"
					maxLength={NAME_LENGTH}
					value={name}
					onChangeText={(value) => setName(value)}
					right={<TextInput.Affix text={`${name?.length || 0}/${NAME_LENGTH}`} />}
					style={{ marginBottom: 12 }}
				/>
				<TextInput
					mode="outlined"
					label="Album Description"
					multiline={true}
					numberOfLines={3}
					maxLength={DESCRIPTION_LENGTH}
					value={description}
					onChangeText={(value) => setDescription(value)}
					right={<TextInput.Affix text={`${description?.length || 0}/${DESCRIPTION_LENGTH}`} />}
				/>
			</View>

			<View style={{ marginBottom: 24 }}>
				<Text variant="titleLarge" style={{ marginBottom: 12 }}>
					Images
				</Text>
				<View
					style={{ backgroundColor: theme.colors.background, overflow: "hidden", borderRadius: 10 }}
				>
					<TouchableRipple onPress={selectImages}>
						<View
							style={{
								padding: 24,
								borderRadius: 10,
								borderWidth: 1,
								borderColor: theme.colors.outline,
								flexDirection: "row",
								alignItems: "center"
							}}
						>
							<Entypo name="images" size={42} color="gray" />
							<View style={{ marginLeft: 24 }}>
								<Text variant="titleLarge">Select Images</Text>
								<Text variant="titleMedium">
									{images.length === 0 ? "None Selected" : `${images.length} Selected`}
								</Text>
							</View>
						</View>
					</TouchableRipple>
				</View>
			</View>

			<View style={{ marginBottom: 24 }}>
				<Text variant="titleLarge" style={{ marginBottom: 12 }}>
					Grouping Method
				</Text>

				<View
					style={{
						padding: 16,
						backgroundColor: theme.colors.background,
						borderRadius: 10,
						borderWidth: 1,
						borderColor: theme.colors.outline
					}}
				>
					<TouchableRipple onPress={() => setMethod("similarity")} style={{ marginBottom: 16 }}>
						<View
							style={{
								padding: 16,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: theme.colors.outline
							}}
						>
							<View style={{ width: "80%" }}>
								<Text variant="titleMedium">Image Similarity</Text>
								<Text variant="labelLarge" style={{ opacity: 0.5 }}>
									Best for smaller collections
								</Text>
							</View>
							<RadioButton
								value="similarity"
								status={method === "similarity" ? "checked" : "unchecked"}
								onPress={() => setMethod("similarity")}
							/>
						</View>
					</TouchableRipple>

					<TouchableRipple onPress={() => setMethod("metadata")}>
						<View
							style={{
								padding: 16,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								borderRadius: 10,
								borderWidth: 1,
								borderColor: theme.colors.outline
							}}
						>
							<View style={{ width: "80%" }}>
								<Text variant="titleMedium">Image Date & Time</Text>
								<Text variant="labelLarge" style={{ opacity: 0.5 }}>
									Best for larger collections
								</Text>
							</View>
							<RadioButton
								value="metadata"
								status={method === "metadata" ? "checked" : "unchecked"}
								onPress={() => setMethod("metadata")}
							/>
						</View>
					</TouchableRipple>
				</View>
			</View>

			<Button mode="contained" labelStyle={{ fontSize: 16 }} onPress={handleSubmit}>
				Create Album
			</Button>
		</View>
	);
}
