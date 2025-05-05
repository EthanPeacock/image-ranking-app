import ErrorPopup from "@/components/ErrorPopup";
import SuccessPopup from "@/components/SuccessPopup";
import { getAlbumDetails, updateAlbumDetails } from "@/utils/db";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function ManageAlbumPage() {
	const NAME_LENGTH = 50;
	const DESCRIPTION_LENGTH = 100;

	const db = useSQLiteContext();
	const { id } = useLocalSearchParams<{ id: string }>();

	const [error, setError] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [description, setDescription] = useState<string>();

	const handleSubmit = async () => {
		if (!name || !description) {
			setError(true);
			return;
		}

		const updated = await updateAlbumDetails(db, { id: Number.parseInt(id), name, description });
		if (!updated) {
			setError(true);
			return;
		}

		setError(false);
		setSuccess(true);
	};

	const fetchAlbum = async () => {
		const albumDetails = await getAlbumDetails(db, Number.parseInt(id));
		
		if (!albumDetails) {
			return;
		}

		setName(albumDetails.name);
		setDescription(albumDetails.description);
	};

	useEffect(() => {
		fetchAlbum();
	}, [])

	return (
		<View style={{ padding: 24, flex: 1 }}>
			<Stack.Screen options={{ title: "Manage Album" }} />

			{error && <ErrorPopup message="Ensure all fields are provided." />}
			{success && <SuccessPopup message="Album details updated successfully." />}

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
					disabled={name == null}
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
					disabled={description == null}
				/>
			</View>

			<Button mode="contained" labelStyle={{ fontSize: 16 }} onPress={handleSubmit}>
				Update Album Details
			</Button>
		</View>
	);
}
