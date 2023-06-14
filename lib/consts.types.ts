export type PostVoteHash = {
	[key: string]: {
		serverTotal: number;
		id?: string;
		value?: number;
	};
};

export type ChannelHash = {
	[key: string]: string;
};
