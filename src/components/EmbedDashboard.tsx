import React, { useCallback, useEffect } from 'react';
import styled from "styled-components";
import { LookerEmbedSDK } from '@looker/embed-sdk';
import axios from 'axios';


const EmbedDashboard = (props: any) => {
    const [dashboard, setDashboard] = React.useState<any>()

    const setupDashboard = (dashboard: any) => {
        setDashboard(dashboard)
    }

    const DashboardDiv = useCallback((el:any) => {
        LookerEmbedSDK.init('https://max-dev.looker.lookerce.dev')
        LookerEmbedSDK.createDashboardWithId(props.id)
        /* since we are already loggedinto extension, we don't need to pass token */
        .appendTo(el)
        .withNext()
        .build()
        .connect()
        .then(setupDashboard)
        .catch((error:any) => {
            console.error('An unexpected error occured', error)
        })
    }, [])

    const [geocords, setGeocords] = React.useState<any>()

    useEffect(() => {
        if (dashboard) {
          // If the dashboard exists, update the state filter
          dashboard.updateFilters({
            "State" : props.state
          })
          dashboard.run()
        }
      
      },[props.state])
    
        // This useEffect gets triggered by changing the yesno
    useEffect(() => {
        // This function will get a users coordinates from the maps API and pass as a filter to the dashboard
        console.log(props.location)
        if (dashboard && props.location) {
        if (props.location == "Yes") {
            if (geocords) {
            // If we have already run the API call use the existing values
            dashboard.updateFilters({"Location":geocords})
            } else {
                // This is where we will call the external API to get users lat/long data
                getGeocords().then((resp) => {
                console.log(resp)
                // Extract the lat and long from the response
                const lat = resp.data.location.lat
                const lng = resp.data.location.lng
                // Construct the string to match what Looker expects
                const filterString = "50 miles from " + String(lat) + ", " + String(lng)
                // Apply to the dashboard
                dashboard.updateFilters({"Location":filterString})
                // Store the results so we don't have to hit the API again
                setGeocords(filterString)
                })
            }
        } else {
            // Reset the dashboard filter is No is selected
            dashboard.updateFilters({"Location":""})
        }
        dashboard.run()
        }
    },[props.location])
    
    


    return (
        <> 
        <Dashboard ref={DashboardDiv}></Dashboard>
        </>
    )
}

const Dashboard = styled.div`
    width: 100%;
    height: 100%;
    & > iframe {
        width: 100%;
        height: 100%;
    }
    `

export default EmbedDashboard