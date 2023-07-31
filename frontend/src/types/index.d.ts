import HLS from "hls.js";
export {};

declare global {
    interface Window {
        hls: HLS;
    }
}
