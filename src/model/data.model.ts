import mongoose  from "mongoose";

const dataSchema = new mongoose.Schema({
    respose: {
        status: {
            type: String
        },
        message: {
            type: String
        },
        data: {
            authorization_url: {
                type: String
            },

            access_mode: {
                type: String
            },
            reference: {
                type: String
            }
    }
}
})

const dataModel = mongoose.model("Data", dataSchema);
export default dataModel;