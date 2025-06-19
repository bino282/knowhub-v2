/**
 * Function extract text field from string
 * @param {string} inputData
 * @return {string}
 */
export default function exactTextFieldString(inputData: string): {
  text: string;
  // answerId: string;
} {
  const dataObjects = inputData.split("data:");
  // console.log("dataObjects", JSON.parse(dataObjects[1]));

  const parsedDataObjects = [];

  let text = "";
  // let answerId = '';

  // console.log(dataObjects)

  // Parse each data object and add it to the array
  for (const obj of dataObjects) {
    try {
      if (obj.startsWith('{"answer')) {
        const parsedObject: any = JSON.parse(obj);
        parsedDataObjects.push(parsedObject);

        text += parsedObject?.choices?.[0].delta?.content;

        // answerId = parsedObject.answerId;
      }
    } catch (error) {
      console.error("Error parsing JSON:", dataObjects);
    }
  }

  return { text };
}
