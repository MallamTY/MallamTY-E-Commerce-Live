import DataURIParser from "datauri/parser";
const parser: DataURIParser = new DataURIParser()


const datauri = (reqbody: any) => {
    if(reqbody.file) {
        const dataUri = parser.format('image', reqbody.file.buffer)
        return dataUri
    }
    else {
        let multidatauri = parser.format('image', reqbody.buffer)
        return multidatauri
    }
   
}

export default datauri;