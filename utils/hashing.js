let {hash, compare} = require('bcryptjs');
const {createHmac} = require('crypto');

let doHash = (value,setvalue) => {
    let result = hash(value,setvalue);
    return result;
}

let doHashValidation = (value,setvalue)=>{
    let result = compare(value,setvalue)
    return result;
}

let hmacProcess = (value,key)=>{
    let result = createHmac('sha256',key).update(value).digest('hex')
    return result;



}

module.exports = {doHash,doHashValidation,hmacProcess};