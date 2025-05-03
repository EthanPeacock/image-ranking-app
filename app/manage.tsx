import ErrorPopup from "@/components/ErrorPopup";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function ManageAlbumPage() {
	const NAME_LENGTH = 50;
	const DESCRIPTION_LENGTH = 100;

	const [error, setError] = useState<boolean>(false);
	const [name, setName] = useState<string>();
	const [description, setDescription] = useState<string>();

	const handleSubmit = () => {
		if (!name || !description) {
			setError(true);
			return;
		}

		setError(false);
		// TODO: handle update
	};

	return (
		<View style={{ padding: 24, flex: 1 }}>
			<Stack.Screen options={{ title: "Manage Album" }} />

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

			<Button mode="contained" labelStyle={{ fontSize: 16 }} onPress={handleSubmit}>
				Update Album Details
			</Button>
		</View>
	);
}
