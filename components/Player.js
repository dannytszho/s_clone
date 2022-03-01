import React, { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtoms";

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [ currentTrackId, setCurrentTrackId ] = useRecoilState(currentTrackIdState);

    const [ isPlaying, setIsPlaying ] = useRecoilState(isPlayingState);
    const [ volume, setVolume ] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now Playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    console.log("Now Playing: ", data.body);
                    setIsPlaying(data.body?.is_Playing);
                })


            });
        }
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(50);

        }
    },[currentTrackId, spotifyApi, session])

    return (
        <div>
            {/* left */}
            <div>
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
            </div>
        </div>
    );
}

export default Player;
