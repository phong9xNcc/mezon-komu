export const BOT_ID = process.env.BOT_KOMU_ID;

export const EMAIL_DOMAIN = 'ncc.asia';

export const MEZON_IMAGE_URL =
  'https://cdn.mezon.vn/1837043892743049216/1840654271217930240/1827994776956309500/857_0246x0w.webp';

export const MEZON_EMBED_FOOTER = {
  text: 'Powered by Mezon',
  icon_url: MEZON_IMAGE_URL,
};

export enum EUserType {
  DISCORD = 'DISCORD',
  MEZON = 'MEZON',
}

export enum BetStatus {
  WIN = 'WIN',
  LOSE = 'LOSE',
  CANCEL = 'CANCEL',
}

export enum EMessageMode {
  CHANNEL_MESSAGE = 2,
  DM_MESSAGE = 4,
  THREAD_MESSAGE = 6,
}

export enum FileType {
  NCC8 = 'ncc8',
  FILM = 'film',
  AUDIOBOOK = 'audioBook',
  MUSIC = 'music',
}

export enum FFmpegImagePath {
  NCC8 = '/dist/public/images/ncc8.png',
  AUDIOBOOK = '/dist/public/images/audiobook.png',
}

export enum ErrorSocketType {
  TIME_OUT = 'The socket timed out while waiting for a response.',
  NOT_ESTABLISHED = 'Socket connection has not been established yet.',
}

export enum DynamicCommandType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface EmbedProps {
  color?: string;
  title?: string;
  url?: string;
  author?: {
    name: string;
    icon_url?: string;
    url?: string;
  };
  description?: string;
  thumbnail?: { url: string };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
    options?: any[];
    inputs?: {};
  }>;
  image?: { url: string };
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
}

export enum EUnlockTimeSheet {
  PM = 'PM',
  STAFF = 'STAFF',
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
}

export enum EUnlockTimeSheetPayment {
  PM_PAYMENT = 50000,
  STAFF_PAYMENT = 20000,
}
