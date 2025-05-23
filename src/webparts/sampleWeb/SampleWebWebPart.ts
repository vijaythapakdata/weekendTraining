import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {sp} from "@pnp/sp/presets/all";

import * as strings from 'SampleWebWebPartStrings';
import SampleWeb from './components/SampleWeb';
import { ISampleWebProps } from './components/ISampleWebProps';

export interface ISampleWebWebPartProps {
  ListName: string;
  CityOptions: any;
}

export default class SampleWebWebPart extends BaseClientSideWebPart<ISampleWebWebPartProps> {
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
     sp.setup({
      spfxContext:this.context as any
     });
     this._getLookUp();
    });
  }

  public async render(): Promise<void> {
    const element: React.ReactElement<ISampleWebProps> = React.createElement(
      SampleWeb,
      {
       ListName:this.properties.ListName,
       context:this.context,
       siteurl:this.context.pageContext.web.absoluteUrl,
       GenderOptions:await this._getDropdownOptions(this.context.pageContext.web.absoluteUrl,this.properties.ListName,'Gender'),
       DepartmentOptions:await this._getDropdownOptions(this.context.pageContext.web.absoluteUrl,this.properties.ListName,'Department'),
        SkillsOptions:await this._getDropdownOptions(this.context.pageContext.web.absoluteUrl,this.properties.ListName,'Skills'),
        CityOptions:this.properties.CityOptions
      }
    );

    ReactDom.render(element, this.domElement);
  }

 




  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: strings.ListFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
  //Get Choice
  private async _getDropdownOptions(siteurl:string,ListName:string,fieldValue:string):Promise<any>{
    try{
      const response=await fetch(`${siteurl}/_api/web/lists/getbytitle('${ListName}')/fields?$filter=EntityPropertyName eq '${fieldValue}'`,
        {
          method:'GET',
          headers:{
            'Accept':'application/json;odata=nometadata'
          }
        }
      )
      if(!response.ok){
        throw new Error('Network response was not ok');
      }
      const data=await response.json();
      const choices=data?.value[0]?.Choices;
      return choices.map((choice:any)=>({
        key:choice,
        text:choice
      }));
    }
    catch(error){
      console.error('Error fetching dropdown options:',error);
   
    }
  }
  //Get Lookup
  private async _getLookUp():Promise<void>{
    try{
      const response=await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Cities')/items?$select=Title,ID`,{
        method:'GET',
        headers:{
          'Accept':'application/json;odata=nometadata'
        }
      });
      if(!response.ok){
        throw new Error('Network response was not ok');
      }
      const data=await response.json();
      const lookupoptions=data.value.map((city:{Title:string,ID:string})=>({
        key:city.ID,
        text:city.Title
      }));
      this.properties.CityOptions=lookupoptions;
    }
    catch(error){
      console.error('Error fetching lookup options:',error);
    }
  }
}
