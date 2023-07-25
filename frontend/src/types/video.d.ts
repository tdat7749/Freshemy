// import { VideoJsPlayer } from "video.js";
import Player from "video.js/dist/types/player";
export type VideoJsOptions = {
    autoplay: boolean;
    controls: boolean;
    responsive: boolean;
    fluid: boolean;
    sources: VideoJsSources[];
};

export type VideoJsSources = {
    src: string;
    type: string;
    res?: string;
    label?: string;
};

export interface MyPlayer extends Player {
    qualityLevels: any;
}
