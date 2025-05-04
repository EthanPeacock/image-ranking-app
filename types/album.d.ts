interface AlbumDetails {
	id: number;
	name: string;
	description: string;
	thumbnail: string | null;
	imgCount: number;
}

interface CreateAlbum {
	name: string;
	description: string;
	images: string[];
}

export type { AlbumDetails, CreateAlbum };
