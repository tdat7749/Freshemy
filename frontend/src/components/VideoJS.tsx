import Hls from 'hls.js';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef } from 'react'
import 'video.js/dist/video-js.css';

type VideoJSType = {
    sourse:string
}

export const VideoJS:React.FC<VideoJSType> = (props) =>{

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() =>{
        const videoElement = videoRef.current

        if(videoElement){
            if(Hls.isSupported()){
                console.log("hls support")
                const hls = new Hls()
                hls.loadSource(`/Bi-ngan-djozz/main.m3u8`)
                hls.on(Hls.Events.MANIFEST_PARSED,(event,data) =>{
                    const availableQuanlities = hls.levels.map(l => l.height)
                    const defaultOptions:Plyr.Options = {
                        controls:[
                            'play-large', // The large play button in the center
                            'restart', // Restart playback
                            'rewind', // Rewind by the seek time (default 10 seconds)
                            'play', // Play/pause playback
                            'fast-forward', // Fast forward by the seek time (default 10 seconds)
                            'progress', // The progress bar and scrubber for playback and buffering
                            'current-time', // The current time of playback
                            'duration', // The full duration of the media
                            'mute', // Toggle mute
                            'volume', // Volume control
                            'captions', // Toggle captions
                            'settings', // Settings menu
                            'pip', // Picture-in-picture (currently Safari only)
                            'airplay', // Airplay (currently Safari only)
                            'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
                            'fullscreen', // Toggle fullscreen
                        ],
                        quality:{
                            default: availableQuanlities[0],
                            options: availableQuanlities,
                            forced: true,
                            onChange: (event) => updateQuanlity(event)
                        }
                    }

                    new Plyr(videoElement,defaultOptions)
                })
                hls.attachMedia(videoElement)
            }
            const updateQuanlity = (newQuanlity:any) => {
                window.hls.levels.forEach((level:any,levelIndex:any) =>{
                    console.log(level,levelIndex,newQuanlity)
                    if(level.height === newQuanlity){
                        window.hls.currentLevel = levelIndex
                    }
                })
            }
        }

    })

    return (
        <div >
            <video className='w-full h-[600px]' ref={videoRef} controls></video>
        </div>
    )
} 

export default VideoJS