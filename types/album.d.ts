interface AlbumDetails {
	id: number;
	name: string;
	description: string;
	thumbnail: string | null;
	imgCount: number;
}

interface SelectedImage {
	filename: string;
	path: string;
}

interface CreateAlbum {
	name: string;
	description: string;
	images: SelectedImages[];
}

interface UpdateAlbum {
	id: number;
	name: string;
	description: string;
}

interface AlbumImages {
	Rank1: string[];
	Rank2: string[];
	Rank3: string[];
}

interface ImageRanking {
	imageId: number;
	rank: number;
}

export type { AlbumDetails, SelectedImage, CreateAlbum, UpdateAlbum, AlbumImages, ImageRanking };
