import React, { useEffect, useContext } from 'react'
import { Download, Return, FindSelected } from '@looker/icons'
import {
 ExtensionContext,
 ExtensionContextData,
 getCore40SDK, 
} from '@looker/extension-sdk-react'
import {ILook} from '@looker/sdk'
import {
 ButtonToggle,
 Button,
 ButtonItemProps,
 ButtonIconProps,
 AvatarIcon,
 Icon,
 IconButton,
 IconButtonProps,
 ButtonItem,
 IconButtonSizes,
 Divider,
 MenuList,
 MenuItem,
 MenuHeading,
 Select,
 CheckboxGroup,
 CheckboxGroupProps,
 RadioGroup,
 RadioGroupProps,
} from '@looker/components'
import EmbedDashboard from './EmbedDashboard'
import EmbedExplore from './EmbedExplore'

const Sidebar = (props: any) => {
    // const id = "thelook::order_items"
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const [folderValues, setFolderValues] =  React.useState({
      placeholder: "Loading values",
      values: []
    })
    const [exploreValues, setExploreValues] = React.useState({
        placeholder: "Loading values",
        values: []
      })
    const [lookValues, setLookValues] = React.useState({
      placeholder: "Loading values",
      values: []
    })
    const [exploreSelected, setExplore] = React.useState('')
    const [folderSelected, setFolder] = React.useState('')
    const [lookSelected, setLook] = React.useState('')

    // get list of explores to be displayed in the drop down 
    const getExplores = async () => {
        try {
          const value = await sdk.ok(sdk.lookml_model(
            'thelook', 'explores'))
          return JSON.parse(JSON.stringify(value)).explores
        } catch (error) {
        }
      }
    
    // gets the folders to be displayed in the drop down
    const LookAccess = async () => {
      try {
        const value = await sdk.ok(sdk.all_folders('name, id'))
        const value2 = JSON.stringify(value)
        const value3 = JSON.parse(value2)
        return value3
      } catch (error) {
      }
    }

    // gets the list of available looks with a folder thats selected
    const availablelooks = async (spaceid?:string) => {
      try {
        if(spaceid){
          var value = await sdk.ok(sdk.search_looks(
            {
              folder_id: spaceid
            }))
        }
        else{
          var value = [] as ILook[]
        }
        return value
      } catch (error) {
      }
    }
    
     useEffect(() => {
        getExplores().then((result:any) => {
        // Restructure the response into the format the select component needs
        const filterables = result.map((r:any) => {
          return ({
            value: "thelook::" + r["name"],
            // Label is what the end user sees
            label: r["label"]
          })
        })
        // Map our new data to how we configured the variables at the top
        const newSelectProps = {
            placeholder: "Choose your Dataset",
            values: filterables
        }
        // Update the select list with our new values
        setExploreValues(newSelectProps)
        })
    },[])

    useEffect(() => {
      LookAccess().then((result) => {
      // Restructure the response into the format the select component needs
      var folders = result.map((r:any) => {
        return ({
          value: r["id"] +1,
          // Label is what the end user sees
          label: r["name"]
        })
      })
      // folders = folders.unshift({'id':0, label: 'None'});
      // Map our new data to how we configured the variables at the top
      const newSelectFolderProps = {
          placeholder: "Choose your Folders",
          values: folders
      }
      // Update the select list with our new values
      setFolderValues(newSelectFolderProps)
      })
      // The empty brackets here mean this function will only run on page load
      // We could instead put a variable in these brackets, and the function would
      // run anytime that variable changed
  },[])

    useEffect(() => {
      console.log('folder selected', folderSelected)
      console.log('look values', lookValues)
      availablelooks(folderSelected).then((result:any) => {
      // Restructure the response into the format the select component needs
      var looks = result.map((r:any) => {
        return ({
          value: r["id"],
          // Label is what the end user sees
          label: r["title"]
        })
      })
      // looks = looks.unshift('None');
      // Map our new data to how we configured the variables at the top
      const newSelectLookProps = {
          placeholder: "Choose your Folders",
          values: looks
      }
      // Update the select list with our new values
      setLookValues(newSelectLookProps)
      })
  },[folderSelected])

    return (
        <>
            <MenuList>
            <MenuItem>
                <Button iconBefore={<Download />}>Generate Export</Button>
                {/* <Select 
                  options={[{ value: 'CSV'},{value: 'PDF'},{value: 'Custom Format 1'},{value: 'Custom Format 2'}]}
                  placeholder="Select Format"
                 /> */}
                </MenuItem>
                <Divider></Divider>
                <MenuHeading>Choose Self Service</MenuHeading>
                <MenuItem><Select
                     options={exploreValues.values}
                     placeholder={exploreValues.placeholder}
                     onChange={setExplore}
                    />
                </MenuItem>
                <Divider></Divider>
                <MenuHeading>Choose Folder</MenuHeading>
                <MenuItem><Select
                     options={folderValues.values}
                     placeholder={folderValues.placeholder}
                     onChange={setFolder}
                    />
                </MenuItem>
                <MenuHeading>List of Reports</MenuHeading>
                <IconButton icon={<FindSelected />} label="Refresh List" />
                <RadioGroup name="Report Grouping" options={lookValues.values} onChange={setLook} />
                
            </MenuList>
            <MenuList>
            { exploreSelected.length > 0 ? <EmbedExplore id={exploreSelected} /> : <></>}
            {/* /* state={state} location={location}/> */}
            </MenuList> 
            
        </>
    )

}
  
export default Sidebar
  