

export const generateOTP = (lengthOTP: number) => {
    var characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';;
    let OTP: string = '';
    for (let i:number = 0; i < lengthOTP; i++){
        OTP += characters.charAt((Math.random() * characters.length));
    }
    return OTP;

};