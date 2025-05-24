import * as React from 'react';
// import styles from './FunctionalComponent.module.scss';
import type { IFunctionalComponentProps } from './IFunctionalComponentProps';
import { Web } from '@pnp/sp/webs';
import { Dialog } from "@microsoft/sp-dialog";
import { IFunctionalComponentState } from './IFunctionalComponentState';
import { PrimaryButton, Slider, TextField } from '@fluentui/react';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
const FunctionalComponent:React.FC<IFunctionalComponentProps> = (props:IFunctionalComponentProps) => {
  const[formData,setFormData]=React.useState<IFunctionalComponentState>({
     Name:"",
      Email:"",
      Age:"",
      PermanentAddress:"",
      Score:0,
      Manager:[],
      ManagerId:[],
      Admin:"",
      AdminId:0,
  })
  //create form
  const createForm=async()=>{
    try{
      const web=Web(props.siteurl);
      const list=web.lists.getByTitle(props.ListName);
      const item=await list.items.add({
        Title:formData.Name,
        EmailAddress:formData.Email,
        Age:parseInt(formData.Age),
        Address:formData.PermanentAddress,
        Score:formData.Score,
        ManagerId:{results:formData.ManagerId},
        AdminId:formData.AdminId,
      });
      Dialog.alert("Item Created Successfully");
      console.log(item);
      setFormData({
        Name:"",
        Email:"",
        Age:"",
        PermanentAddress:"",
        Score:0,
        Manager:[],
        ManagerId:[],
        Admin:"",
        AdminId:0,
      });
    }catch(error){
      console.error(error);
    }
  }
  //
  const _getManager=(items:any)=>{
    const managerId=items.map((item:any)=>item.Id);
    const managerName=items.map((item:any)=>item.Title);
    setFormData(prev=>({...prev,ManagerId:managerId,Manager:managerName}));
  }
  //Admin
  const _getAdmins=(items:any[])=>{
    if(items.length>0){
      const adminId=items[0].Id;
      const adminName=items[0].Title;
      setFormData(prev=>({...prev,AdminId:adminId,Admin:adminName}));
  }
  else{
    setFormData(prev=>({...prev,AdminId:0,Admin:""}));
  }
}
//Form Event
const handleChange=(fieldValue:keyof IFunctionalComponentState, value:string|number|boolean)=>{
  setFormData(prev=>({...prev,[fieldValue]:value}));

}
return(
  <>
  <TextField
  label='Name'
  value={formData.Name}
  onChange={(e, newValue) => handleChange('Name', newValue || '')}
  />
  <TextField
  label='Emial'
  value={formData.Email}
  onChange={(e, newValue) => handleChange('Email', newValue || '')}
  iconProps={{iconName:'mail'}}

  />
<TextField
  label='Age'
  value={formData.Age}
  onChange={(e, newValue) => handleChange('Age', newValue || '')}
  />
  <TextField
  label='Address'
  value={formData.PermanentAddress}
  onChange={(e, newValue) => handleChange('PermanentAddress', newValue || '')}
  multiline
  rows={5}
  />
  <Slider
  max={100}min={1}step={1}
  label='Score'
  value={formData.Score}
  onChange={(value) => handleChange('Score', value)}
  />
   <PeoplePicker
      context={props.context as any}
      ensureUser={true}
      titleText='Manager'
      personSelectionLimit={3}
      principalTypes={[PrincipalType.User]}
      defaultSelectedUsers={formData.Manager}
      onChange={_getManager}
      resolveDelay={1000}
      webAbsoluteUrl={props.siteurl}
      />
      <PeoplePicker
      context={props.context as any}
      ensureUser={true}
      titleText='Admin'
      personSelectionLimit={1}
      principalTypes={[PrincipalType.User]}
      defaultSelectedUsers={[formData.Admin ? formData.Admin : ""]}
      onChange={_getAdmins}
      resolveDelay={1000}
      webAbsoluteUrl={props.siteurl}
      />
      <br/>
      <PrimaryButton text='Save' onClick={createForm} iconProps={{iconName:'save'}} />
  </>
)
}
export default FunctionalComponent;