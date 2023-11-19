async function query(data) {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        headers: {
          "Accept": "image/png",
          "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }
//testing api since the given is very slow
// async function query(data) {
//   const response = await fetch(
//     "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
//     {
//       headers: {
//         "Accept": "image/png",
//         "Authorization": "Bearer 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",
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify(data),
//     }
//   );
//   const result = await response.blob();
//   return result;
// }
  
  export default query;
  