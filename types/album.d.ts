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
	method: string;
}

interface AlbumCreated {
	albumId: number;
	imgPaths: string[];
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
	path: string;
	rank: number;
}

interface ReRankAlbum {
	images: string[];
	method: string;
}

export type { AlbumDetails, SelectedImage, CreateAlbum, AlbumCreated, UpdateAlbum, AlbumImages, ImageRanking, ReRankAlbum };
