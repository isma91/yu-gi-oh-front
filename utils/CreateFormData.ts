/**
 * 
 * Create a FormData object and append when it's a file
 * 
 * @param {object} data 
 * @returns {FormData}
 */
function CreateFormData(data: {[key in string]: any}): FormData {
    let formData: FormData = new FormData();
    for (let keyData in data) {
        const valueData = data[keyData];
        formData.append(keyData, valueData);
    }
    return formData;
}

export default CreateFormData;