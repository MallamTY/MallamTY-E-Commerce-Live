import cloudinary from 'cloudinary';
import DataURIParser from 'datauri/parser';
import { API_KEY, API_SECRET, CLOUD_NAME, SECURE } from '../accessories/configuration';
import datauri from './dataUri';


// Setting The Cloudinary Configurations


export const cloudinaryConfig: {
  cloud_name: any;
  api_key: any;
  api_secret: any;
  secure: any;
  
} = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: SECURE,

}


//const { CLOUD_NAME, API_KEY, API_SECRET, SECURE } = require('../configuration/configuration');
//const { datauri, dataurii, multiDataUri } = require('../helpers/dataUri');


const cloudConfig = cloudinary.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: SECURE
})

export const uploads = async (body: any, folder: any) => {
    const dataUri: any = datauri(body);
    return cloudinary.v2.uploader.upload(dataUri.content,{resource_type: 'auto', 
    use_filename: true,
    folder: folder}).then(result => {
        return result
    }).catch(err => {
        return err
    })
}

export const multiUpload = async(body: any, folder: any) => {
    const dataUri: any = datauri(body);
   return cloudinary.v2.uploader.upload(dataUri.content, {resource_type: 'auto', 
   use_filename: true, unique_filename: true,
   folder: folder}, function (err, result) {
       if(err) return err
       return result
   })
}


export const deleteImage = async(public_id: string) => {
    return cloudinary.v2.uploader.destroy(public_id, function(err, data) {
        if(err) return err;
    }) 
}

export const updateUpload = async (body:any, folder:any) => {
    const dataUri: any = datauri(body)
    return cloudinary.v2.uploader.upload(dataUri.content,{resource_type: 'auto', 
    use_filename: true, unique_filename: false, public_id: 'UpdateTesting/e2g9wkwgq8mslf7wklzr',
    folder: folder}, function (err, result) {
        if(err) return err
        return result
    })
}
 
