import type { AlbumDetails, CreateAlbum } from "@/types/album";
import type { SQLiteDatabase } from "expo-sqlite";

async function createTablesIfNeeded(db: SQLiteDatabase) {
	await db.withTransactionAsync(async () => {
		await db.execAsync("PRAGMA foreign_keys = ON;");

		// create the image table first, because it is needed for album as FK
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS image (
				image_id INTEGER PRIMARY KEY AUTOINCREMENT,
				path TEXT NOT NULL UNIQUE
			);
		`);

		// create album table
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS album (
				album_id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT NOT NULL,
				date_ranked TEXT,
				thumbnail INTEGER,
				FOREIGN KEY (thumbnail) REFERENCES image(image_id)
			);
		`);

		// finally, create the album image table - which also stores ranking
		await db.execAsync(`
			CREATE TABLE IF NOT EXISTS album_image (
				album_id INTEGER NOT NULL,
				image_id INTEGER NOT NULL,
				rank INTEGER,
				PRIMARY KEY (album_id, image_id),
				FOREIGN KEY (album_id) REFERENCES album(album_id),
				FOREIGN KEY (image_id) REFERENCES image(image_id)
			);
		`);
	});
}

async function getAlbums(db: SQLiteDatabase): Promise<AlbumDetails[]> {
	const albums = await db.getAllAsync<AlbumDetails>(`
		SELECT
			album.album_id AS id, album.name, album.description, album.thumbnail,
			COUNT(album_image.image_id) AS imgCount
		FROM album
		LEFT JOIN album_image ON album.album_id = album_image.album_id
		GROUP BY album.album_id;
	`);

	return albums
}

async function createAlbum(db: SQLiteDatabase, albumDetails: CreateAlbum): Promise<boolean> {
	try {
		await db.withTransactionAsync(async () => {
			const createdAlbum = await db.runAsync("INSERT INTO album (name, description) VALUES (?, ?)", albumDetails.name, albumDetails.description);

			const checkImgStatement = await db.prepareAsync("SELECT image_id AS imgId FROM image WHERE path = $path");
			const imgStatement = await db.prepareAsync("INSERT INTO image (path) VALUES ($path)");
			const albumImgStatement = await db.prepareAsync("INSERT INTO album_image (album_id, image_id) VALUES ($albumId, $imageId)");

			for (const path of albumDetails.images) {
				let imgId: number;
				const img = await checkImgStatement.executeAsync<{ imgId: number }>({ $path: path });
				const imgExists = await img.getFirstAsync();
				if (!imgExists) {
					const createdImg = await imgStatement.executeAsync({ $path: path });
					imgId = createdImg.lastInsertRowId;
				} else {
					imgId = imgExists.imgId;
				}

				await albumImgStatement.executeAsync({ $albumId: createdAlbum.lastInsertRowId, $imageId: imgId });
			}
		});

		return true;
	} catch {
		return false;
	}
}

export { createTablesIfNeeded, getAlbums, createAlbum };
