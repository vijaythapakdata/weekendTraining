import * as React from 'react';
// import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './IHelloWorldProps';
import { DefaultButton, IconButton, PrimaryButton, Slider, TextField } from '@fluentui/react';

export default class HelloWorld extends React.Component<IHelloWorldProps> {
  public render(): React.ReactElement<IHelloWorldProps> {
   

    return (
   <>
   <h1>hello ram !!!!</h1>
   <PrimaryButton text="Save" iconProps={{iconName:'save'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
   <DefaultButton text="Cancel" iconProps={{iconName:'cancel'}}/>&nbsp;&nbsp;&nbsp;&nbsp;
   <IconButton iconProps={{iconName:'Delete'}}/>
   <hr/>
   <form>
    <TextField type='text' placeholder='vijay thapak' label='Name' iconProps={{iconName:'people'}} required/>
    <TextField type='password' label='Password'/>
    <TextField type='text' placeholder='write your address....' label='Permanent Address' multiline rows={5} iconProps={{iconName:'home'}}/>
    <TextField prefix='$' label='Salary' suffix='USD'/>
    <TextField type='text' label='Error Message' errorMessage='Helo'/>
    <Slider label='Slider' max={100} min={1} step={1}/>

   </form>
   
   </>
    );
  }
}
