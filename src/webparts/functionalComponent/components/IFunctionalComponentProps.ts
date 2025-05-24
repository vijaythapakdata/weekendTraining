import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFunctionalComponentProps {
  ListName:string;
  siteurl:string;
  context:WebPartContext;
}
