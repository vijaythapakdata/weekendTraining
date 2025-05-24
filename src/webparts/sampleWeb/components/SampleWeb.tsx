import * as React from 'react';
// import styles from './SampleWeb.module.scss';
import type { ISampleWebProps } from './ISampleWebProps';
import { ISampleWebState } from './ISampleWebState';
import { Web } from '@pnp/sp/webs';
import {Dialog} from "@microsoft/sp-dialog";
import { ChoiceGroup, Dropdown, IDropdownOption, Label, PrimaryButton, Slider, TextField } from '@fluentui/react';
import {PeoplePicker, PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker";
export default class SampleWeb extends React.Component<ISampleWebProps,ISampleWebState> {
  constructor(props:ISampleWebProps,state:ISampleWebState){
    super(props);
    this.state={
      Name:"",
      Email:"",
      Age:"",
      PermanentAddress:"",
      Score:0,
      Manager:[],
      ManagerId:[],
      Admin:"",
      AdminId:0,
      City:"",
      Department:"",
      Skills:[],
      Gender:"",
      DOB:"",
      Attachments:[]

    }
  }
  //create function

  public async createForm(){
   try{
    const web=Web(this.props.siteurl);
    const list=web.lists.getByTitle(this.props.ListName);
    const item=await list.items.add({
      Title:this.state.Name,
      EmailAddress:this.state.Email,
      Age:parseInt(this.state.Age),
      Address:this.state.PermanentAddress,
      Score:this.state.Score,
      ManagerId:{results:this.state.ManagerId},
      AdminId:this.state.AdminId,
      Department:this.state.Department,
      Gender:this.state.Gender,
      CityId:this.state.City,
      Skills:{results:this.state.Skills},
      DOB:new Date(this.state.DOB),
    });
    const itemId=item.data.Id;
    //upload attachemets
    for(const file of this.state.Attachments){
      const arrayBuffer=await file.arrayBuffer();
      await list.items.getById(itemId).attachmentFiles.add(file.name,arrayBuffer);
    }

    Dialog.alert("Item Created Successfully");
    this.setState({
      Name:"",
      Email:"",
        Age:"",
      PermanentAddress:"",
      Score:0,
      Manager:[],
      ManagerId:[],
      Admin:"",
      AdminId:0,
      City:"",
      Department:"",
      Skills:[],
      Gender:"",
      DOB:"",
      Attachments:[]
    })
   }
    catch(error){
      console.log(error);
      Dialog.alert("Error in creating item");
    }
  }
  //form event
  private HandleChange=(fieldvalue:keyof ISampleWebState,value:string|number|boolean):void=>{
    this.setState({[fieldvalue]:value}as unknown as Pick<ISampleWebState,keyof ISampleWebState>);
  }
  //Upload files
  private uploadFiles=(event:React.ChangeEvent<HTMLInputElement>):void=>{
    const files=event.target.files;
    if(files){
      this.setState({
        Attachments:Array.from(files)
      })
    }
  }
  //Get Skiils
  private _getSkills=(event:React.FormEvent<HTMLDivElement>,option:IDropdownOption):void=>{
const selectedKey=option.selected?[...this.state.Skills,option.key as string]:this.state.Skills.filter((key:any)=>key!==option.key);
this.setState({
  Skills:selectedKey
});
  }
  //Reset form
  private resetForm=():void=>{
    this.setState({
      Name:"",
      Email:"",
        Age:"",
      PermanentAddress:"",
      Score:0,
      Manager:[],
      ManagerId:[],
      Admin:"",
      AdminId:0,
      City:"",
      Department:"",
      Skills:[],
      Gender:"",
      DOB:"",
      Attachments:[]
    });
  }
  public render(): React.ReactElement<ISampleWebProps> {
    

    return (
    <>
    <TextField label='Name' value={this.state.Name}
    onChange={(_,event)=>this.HandleChange("Name",event||"")}
    />
     <TextField label='Email Address' value={this.state.Email}
    onChange={(_,event)=>this.HandleChange("Email",event||"")}
    />
     <TextField label='Age' value={this.state.Age}
    onChange={(_,event)=>this.HandleChange("Age",event||"")}
    />

<TextField label='Permanent Address' value={this.state.PermanentAddress}
    onChange={(_,event)=>this.HandleChange("PermanentAddress",event||"")}
    multiline rows={5}
    iconProps={{iconName:'home'}}
    />
    <Slider label='Score' max={100} min={0} step={1} value={this.state.Score}
    onChange={(value)=>this.HandleChange("Score",value)}/>

    <PeoplePicker
    context={this.props.context as any}
    ensureUser={true}
    titleText='Manager'
    personSelectionLimit={3}
    principalTypes={[PrincipalType.User]}
    defaultSelectedUsers={this.state.Manager}
    onChange={this._getManager}
    resolveDelay={1000}
    webAbsoluteUrl={this.props.siteurl}
    />
    <PeoplePicker
    context={this.props.context as any}
    ensureUser={true}
    titleText='Admin'
    personSelectionLimit={1}
    principalTypes={[PrincipalType.User]}
defaultSelectedUsers={[this.state.Admin?this.state.Admin:""]}
    onChange={this._getAdmin}
    resolveDelay={1000}
    webAbsoluteUrl={this.props.siteurl}
    />
    <Dropdown
    label='Department'
    selectedKey={this.state.Department}
    options={this.props.DepartmentOptions}
    onChange={(_,option)=>this.HandleChange("Department",option?option.key:"")}
    placeholder='Select Department'
    />
    <Dropdown
    label='City'
    selectedKey={this.state.City}
    options={this.props.CityOptions}
    onChange={(_,option)=>this.HandleChange("City",option?option.key:"")}
    placeholder='Select City'
    />
    <ChoiceGroup
    label='Gender'
    selectedKey={this.state.Gender}
    options={this.props.GenderOptions}
    onChange={(_,option)=>this.HandleChange("Gender",option?option.key:"")}
    // placeholder='Select Department'
    />
    <Dropdown
    label='Skills'
    // selectedKey={this.state.Cit}
    defaultSelectedKeys={this.state.Skills}
    options={this.props.SkillsOptions}
    // onChange={(_,option)=>this.HandleChange("City",option?option.key:"")}
    onChange={this._getSkills}
    placeholder='select Skills'
    multiSelect
    />
    <Label>Upload Attachments</Label>
    <input type='file' multiple onChange={this.uploadFiles}/>
    <br/>
    <PrimaryButton text=' Save' onClick={()=>this.createForm()} iconProps={{iconName:'save'}}/>&nbsp;&nbsp;&nbsp;
    <PrimaryButton text='Reset' onClick={this.resetForm} iconProps={{iconName:'reset'}}/>
    </>
    );
  }
  //Manager Selection
  private _getManager=(items:any):void=>{
    const managers=items.map((item:any)=>item.text);
    const managersId=items.map((item:any)=>item.id);
    this.setState({
      Manager:managers,
      ManagerId:managersId
    });
  }
  //Admin Selection

  private _getAdmin=(item:any):void=>{
    if(item.length>0){
      this.setState({
        Admin:item[0].text,
        AdminId:item[0].id
      });
    }
    else{
      this.setState({
        Admin:"",
        AdminId:0
      });
    }
  }
}
