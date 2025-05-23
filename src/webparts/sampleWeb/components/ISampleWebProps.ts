import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISampleWebProps {
 ListName:string;
 siteurl:string;
 context:WebPartContext;
 CityOptions:any;
 DepartmentOptions:any;
 SkillsOptions:any;
 GenderOptions:any;
}
