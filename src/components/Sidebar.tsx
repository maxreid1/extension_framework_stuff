import React, { useEffect, useContext } from 'react'
import { Download, Return, FindSelected, AnalyticsApp} from '@looker/icons'
import { Favorite } from '@styled-icons/material/Favorite'
import { Favorite as FavoriteOutline } from '@styled-icons/material-outlined/Favorite'
import {
 ExtensionContext,
 ExtensionContextData,
 getCore40SDK, 
} from '@looker/extension-sdk-react'
import {ILook} from '@looker/sdk'
import {
 ButtonToggle,
 Paragraph,
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
 ListItem,
 Box,
 List
} from '@looker/components'
import EmbedDashboard from './EmbedDashboard'
import EmbedExplore from './EmbedExplore'

interface LookInt {
  label: string,
  id: string
}

export default function Sidebar (props: any) {
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
    const sdk = extensionContext.core40SDK
    const [folderValues, setFolderValues] =  React.useState<any[]>([])
    const [lookValues, setLookValues] = React.useState<LookInt[]>([])
    const [folderSelected, setFolder] = React.useState('')
    const [looksSelected, setLooks] = React.useState<LookInt[]>([])

    // const [exploreValues, setExploreValues] = React.useState({
    //     placeholder: "Loading values",
    //     values: []
    //   })
    // const [exploreSelected, setExplore] = React.useState('')

    // get list of explores to be displayed in the drop down 
    // const getExplores = async () => {
    //     try {
    //       const value = await sdk.ok(sdk.lookml_model(
    //         'thelook', 'explores'))
    //       return JSON.parse(JSON.stringify(value)).explores
    //     } catch (error) {
    //     }
    //   }
    
    // gets the folders to be displayed in the drop down
    const FolderList = async () => {
      try {
        const value = await sdk.ok(sdk.all_folders('name, id'))
        return JSON.parse(JSON.stringify(value))
      } catch (error) {
      }
    }

    // gets the list of available looks with a folder thats selected
    const availableLooks = async (spaceid?:string) => {
      try {
        if(spaceid){
          var value = await sdk.ok(sdk.search_looks({folder_id: spaceid}));
          console.log(value);
        }
        else{
          var value = [] as ILook[]
        }
        return value
      } catch (error) {
      }
    }
  
    useEffect(() => {
      FolderList().then((result) => {
      // Restructure the response into the format the select component needs
      var folders = result.map((r:any) => {
        return ({
          value: r["id"],
          // Label is what the end user sees
          label: r["name"]
        })
      })
      // Update the select list with our new values
      setFolderValues(folders)
      })
  },[])

    useEffect(() => {
      availableLooks(folderSelected).then((result:any) => {
      if(result){
        // Restructure the response into the format the select component needs
        var looks = result.map((r:any) => {
          return ({
            value: r["id"],
            // Label is what the end user sees
            label: r["title"]
          })
        })
        // Update the select list with our new values
        setLookValues(looks)
        }
      })
  },[folderSelected])

    // Function to add the look from the cart
    const addLook = (look:LookInt) => {
      var currentLooks = [];
      looksSelected.forEach((l: LookInt) => currentLooks.push(Object.assign({}, l)))
      currentLooks.push({...look});
      console.log('Look to be added ', look)
      setLooks(currentLooks);
      console.log(JSON.stringify(looksSelected));
    }


    // Function to remove the look from the cart
    const removeLook = (id:string) => {
      var currentLooks: LookInt[] = [];
      looksSelected.forEach( (l: LookInt) => 
            {if(l.id != id){currentLooks.push(Object.assign({}, l))}})
      setLooks(currentLooks);
    }
    
    return (
        <>
            <MenuList>
            {/* <MenuItem> */}
                {/* <Button iconBefore={<Download />}>Generate Export</Button> */}
                {/* <Select 
                  options={[{ value: 'CSV'},{value: 'PDF'},{value: 'Custom Format 1'},{value: 'Custom Format 2'}]}
                  placeholder="Select Format"
                 /> */}
                {/* </MenuItem> */}
                {/* <Divider></Divider>
                <MenuHeading>Choose Self Service</MenuHeading>
                <MenuItem><Select
                     options={exploreValues.values}
                     placeholder={exploreValues.placeholder}
                     onChange={setExplore}
                    />
                </MenuItem> */}
                <Divider></Divider>
                <MenuHeading>Choose Folder</MenuHeading>
                <MenuItem><Select
                     options={folderValues}
                     placeholder="Loading folders"
                     defaultValue=''
                     onChange={setFolder}
                    />
                </MenuItem>
                <MenuHeading>List of Reports</MenuHeading>
                {/* <IconButton icon={<FindSelected />} label="Refresh List" /> */}
                { lookValues.length > 0 
                  ? <List>
                      {lookValues.map((look,id) => <ButtonListItem key={id} look={look} addLook={addLook} removeLook={removeLook}></ButtonListItem>)}
                  </List>  
                  : <Paragraph>No looks in this folder</Paragraph>}                
            </MenuList>
      
            {/* { exploreSelected.length > 0 ? <EmbedExplore id={exploreSelected} /> : <></>} */}
            {/* /* state={state} location={location}/> */}
            <MenuList>
            <MenuHeading>Selected Reports</MenuHeading>
            
             {/* <Paragraph> Current selection: {lookValues.values.join(', ')}</Paragraph> */}
             </MenuList>
             <MenuList>
    
            <MenuHeading>Don't See A Report?</MenuHeading>
             <Button iconBefore={<AnalyticsApp />}>Create Your Own Report</Button>
             </MenuList>
            <Paragraph>Currently selected looks: {JSON.stringify(looksSelected)}</Paragraph>
        </>
    )

}

// name of the look, id
interface ButtonListItemInt {
  'look':LookInt
  'addLook':Function,
  'removeLook':Function
}

export function ButtonListItem (props: ButtonListItemInt){
  const [isSelected, setSelected] = React.useState(false)

  // Handle selections for look, and pass back to parent state
  useEffect(() => {
    const handleSelection = () => {
      if(isSelected){props.addLook(props.look)}
      else{props.removeLook(props.look.id)}
    }
    handleSelection()
  },[isSelected])

  return(
    <ListItem>
      <Paragraph>{props.look.label}</Paragraph>
      <IconButton
        label='Add to Report'
        icon={isSelected ? <Favorite/> : <FavoriteOutline/> }
        toggle={isSelected}
        onClick={() => setSelected(!isSelected)}
      />
    </ListItem>
  )
}



    //  useEffect(() => {
    //     getExplores().then((result:any) => {
    //     // Restructure the response into the format the select component needs
    //     const filterables = result.map((r:any) => {
    //       return ({
    //         value: "thelook::" + r["name"],
    //         // Label is what the end user sees
    //         label: r["label"]
    //       })
    //     })
    //     // Map our new data to how we configured the variables at the top
    //     const newSelectProps = {
    //         placeholder: "Choose your Dataset",
    //         values: filterables
    //     }
    //     // Update the select list with our new values
    //     setExploreValues(newSelectProps)
    //     })
    // },[])