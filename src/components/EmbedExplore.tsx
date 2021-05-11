import React, { useCallback, useEffect } from 'react';
import styled from "styled-components";
import { LookerEmbedSDK } from '@looker/embed-sdk';
import axios from 'axios';


const EmbedExplore = (props: any) => {
    const [explore, setExplore] = React.useState<any>()

    const setupExplore = (explore: any) => {
        setExplore(explore)
    }

    const ExploreDiv = useCallback((el:any) => {
        LookerEmbedSDK.init('https://max-dev.looker.lookerce.dev')
        LookerEmbedSDK.createExploreWithId(props.id)
        /* since we are already loggedinto extension, we don't need to pass token */
        .appendTo(el)
        // .withNext()
        .build()
        .connect()
        .then(setupExplore)
        .catch((error:any) => {
            console.error('An unexpected error occured', error)
        })
    }, [])

    return (
        <> 
        <Explore ref={ExploreDiv}></Explore>
        </>
    )
}

const Explore = styled.div`
    width: 100%;
    height: 100%;
    & > iframe {
        width: 100%;
        height: 100%;
    }
    `

export default EmbedExplore