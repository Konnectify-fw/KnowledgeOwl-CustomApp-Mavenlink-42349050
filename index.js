const AWS = require("aws-sdk");
// const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// var fs = require("fs");
var axios = require("axios");
var btoa = require("btoa");
// var FormData = require("form-data");
// var https = require("https");
// const { format } = require("path");
// require('dotenv').config();
const csv = require('csvtojson');
const S3 = new AWS.S3();


exports.handler = async (event) => {

  
  const data = JSON.parse(event.body);
  console.log(data, "sample payoad");
  const article_id = data.freshServiceId;
  const project_id = data.project_id;
  const iparams = data.iparams;
  var folder_id = "";

  console.log(project_id,"KnowledgeOWL folderId");


  const params = {
    Bucket: 'knowledge-owl',
    Key: 'know.csv'
  };


  async function csvToJSON() {
    console.log(params,"parasms")
    console.log("csvtojson")
    // get csv file and create stream
    const stream = S3.getObject(params).createReadStream();
    // convert csv file (stream) to JSON format data
    const json = await csv().fromStream(stream);
    console.log(json, "string");
    return json;

  };
  let folderJSON=await csvToJSON();

for(let i=0;i<folderJSON.length;i++){
  if(folderJSON[i].project_id===project_id){
folder_id=folderJSON[i].folder_id
  }
}


  // console.log(
  //   iparams,
  //   article_title,
  //   article_desc,
  //   article_status,
  //   article_type,
  //   article_tags,
  //   article_attachment,
  //   "success"
  // );

  await updateArticle(
        article_id,
        folder_id,
        iparams
      );
    


  // const attach = await formatAttachments(article_attachment);
  // console.log(attach, "attachment format");

  //condition to check the type of article
  // console.log(type == "article.create", "true/false");
  // console.log(type == "article.update", "true/false");

  // if (type == "article.create") {
  //   console.log("entered into article create");
  //   await createArticle(
  //     iparams,
  //     folder_id,
  //     article_title,
  //     article_desc,
  //     article_status,
  //     article_type,
  //     article_tags,
  //     attach
  //   );
  // }
  // if (type == "article.update") {
  //   await updateArticle(
  //     article_id,
  //     folder_id,
  //     iparams,
  //     article_title,
  //     article_desc,
  //     article_status,
  //     article_type,
  //     article_tags,
  //     attach
  //   );
  // }

  // async function formatAttachments(attachments) {
  //   console.log("formatAttachments");
  //   console.log(attachments, "attachment from arguments");
  //   const attachment_obj = [];
  //   console.log(attachment_obj, "attach");
  //   for (let i in attachments) {
  //     let attactment_name = attachments[i].slice(
  //       attachments[i].lastIndexOf("/") + 1
  //     );
  //     console.log({ attactment_name });
  //     // for (let i = 0; i < attachments.length; i++) {
  //     const file = fs.createWriteStream("/tmp/" + attactment_name);
  //     const req = https.get("https://" + attachments[i], function (response) {
  //       console.log("entering info https get");
  //       response.pipe(file);
  //     });
  //     await sleep(3000);

  //     attachment_obj[i] = fs.createReadStream("/tmp/" + attactment_name);
  //     // console.log(attachment_obj[i], "full values for attachments")
  //   }
  //   // console.log(file, "filefilefile");
  //   console.log(attachment_obj, "attachment_obj");
  //   return attachment_obj;
  // }

  // function sleep(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms);
  //   });
  // }

  // async function createArticle(
  //   iparams,
  //   folder_id,
  //   ar_title,
  //   ar_des,
  //   ar_stat,
  //   ar_ty,
  //   ar_tags = [],
  //   ar_attach = []
  // ) {
  //   var data = new FormData();
  //   console.log("entered into CreateArticle");
  //   data.append("description", ar_des);
  //   data.append("title", ar_title);
  //   data.append("status", ar_stat);
  //   data.append("folder_id", folder_id);
  //   data.append("article_type", ar_ty);
  //   for (let i = 0; i < ar_tags.length; i++) {
  //     data.append("tags[]", ar_tags[i]);
  //   }
  //   for (let i = 0; i < ar_attach.length; i++) {
  //     data.append("attachments[]", ar_attach[i]);
  //   }

  //   var config = {
  //     method: "post",
  //     url: `https://${iparams.url}/api/v2/solutions/articles`,
  //     headers: {
  //       Authorization: `Basic ` + btoa(`${iparams.api_key}:X`),
  //       ...data.getHeaders(),
  //     },
  //     data: data,
  //   };
  //   console.log(config, "configconfig");

  //   try {
  //     console.log("entered into create try");
  //     const result = await axios(config);
  //     console.log(result, "Create Result");
  //     return result.data;
  //   } catch (err) {
  //     console.log(err, "create err");
  //   }
  // }
  async function updateArticle(
    article_id,
    folder_id,
    iparams
  ) {
    console.log(folder_id,"logn")
    // var data = new FormData();
    // console.log("entered into Update Article");
   
    // data.append("folder_id", folder_id);
   
    // for (let i = 0; i < ar_tags.length; i++) {
    //   data.append("tags[]", ar_tags[i]);
    // }
    // for (let i = 0; i < ar_attach.length; i++) {
    //   data.append("attachments[]", ar_attach[i]);
    // }

    var data = JSON.stringify({
      "folder_id": parseInt(folder_id)
    });
    

    var config = {
      method: "put",
      url: `https://${iparams.url}/api/v2/solutions/articles/${article_id}`,
      headers: {
        Authorization: `Basic ` + btoa(`${iparams.api_key}:X`),
        "Content-Type":"application/json"
      },
      data: data,
    };
    console.log(config, "configconfig");
    console.log(data, "configconfig");
    try {
      console.log("entered into update try");
      const result = await axios(config);
      console.log(result, "Update Result");
      return result.data;
    } catch (err) {
      console.log(err, "create err");
    }
  }

};
