/* * */
/* * */
/* * * * * */
/* STORAGE HANDLING */
/* * */

/* * */
/* IMPORTS */
const config = require("config");
const aws = require("aws-sdk");

/* * */
/* NOMENCLATURE */
/* */
/*
/* fileTitle => refers to only the given title for the file (foo).
/* fileExt   => refers to mimetype extension of the file (jpeg).
/* fileName  => refers to complete file name (foo.jpeg).
/* fileKey   => refers to the file path from bucket root (folder/foo.jpeg).
/* fileURL   => refers to the full URL where fi le is available on the web.
/*
/* */
/* * */

/* * */
/* Create a new instance of S3 Storage Controller */
/* This is the object responsible for managing files */
const S3 = new aws.S3({
  endpoint: new aws.Endpoint(config.get("storage.endpoint")),
  accessKeyId: config.get("storage.key"),
  secretAccessKey: config.get("storage.secret")
});

/* * */
/* Upload method for files. */
/* Uploads one file at a time and returns its location URL */
async function uploadFile(key, file, acl) {
  // If storage is not enabled, skip operation
  if (!config.get("storage.enabled")) return "no-href";

  const params = {
    Bucket: config.get("storage.bucket"),
    Key: key,
    Body: file,
    ACL: acl ? acl : "public-read"
  };

  let fileURL = "";
  await S3.upload(params)
    .promise()
    .then(uploadedFile => {
      fileURL = uploadedFile.Location;
      console.log("New file available at ", fileURL);
    })
    .catch(err => {
      console.log(err);
    });

  return fileURL;
}

/* * */
/* ChangeFileName method for files. */
/* Creates a copy of the file with the new name and deletes the old one */
/* Returns the new URL */
async function changeFileName(oldKey, newKey) {
  S3.copyObject({
    Bucket: config.get("storage.bucket"),
    CopySource: config.get("storage.bucket") + "/" + oldKey,
    Key: newKey,
    ACL: "public-read"
  })
    .promise()
    .then(async () => {
      await deleteFile(oldKey);
    })
    .catch(err => console.log(err));

  return createURLFromKey(newKey);
}

/* * */
/* Delete method for files. */
/* Deletes one file at a time and returns true or false */
async function deleteFile(key) {
  // If storage is not enabled, skip operation
  if (!config.get("storage.enabled")) return true;

  const params = {
    Bucket: config.get("storage.bucket"),
    Key: key
  };

  fileHasBeenDeleted = false;

  await S3.deleteObject(params)
    .promise()
    .then(() => {
      fileHasBeenDeleted = true;
    })
    .catch(err => {
      console.log(err);
    });

  return fileHasBeenDeleted;
}

/* */
/* * */
/* HELPER METHODS */
/* * */

/* * */
/* Helper method to concatenate file name and extension. */
/* Adds the name, the dot and the extension */
function createFileName(fileTitle, mimetype) {
  return fileTitle + "." + mimetype.split("/").pop();
}

/* * */
/* Helper method to create complete key for file. */
/* Adds the root folder, content type path, name and the extension */
function createFileKey(path, fileName) {
  return config.get("storage.content-folder") + "/" + path + "/" + fileName;
}

/* * */
/* Helper method to create file name and complete key. */
/* Adds the root folder, content type path, name and the extension */
function createFileNameAndKey(path, fileTitle, mimetype) {
  const fileName = createFileName(fileTitle, mimetype);
  return createFileKey(path, fileName);
}

/* * */
/* Helper method to extract file name from URL. */
/* Return the path from root, without the domain */
function extractKeyFromURL(URL) {
  const bucket = config.get("storage.bucket");
  const endpoint = config.get("storage.endpoint");
  const stringToRemoveFromURL = bucket + "." + endpoint + "/";

  return URL.split(stringToRemoveFromURL).pop();
}

/* * */
/* Helper method to create URL from fileKey. */
/* Return the bucket, endpoint and key */
function createURLFromKey(key) {
  const bucket = config.get("storage.bucket");
  const endpoint = config.get("storage.endpoint");
  return "https://" + bucket + "." + endpoint + "/" + key;
}

exports.uploadFile = uploadFile;
exports.changeFileName = changeFileName;
exports.deleteFile = deleteFile;

exports.createFileName = createFileName;
exports.createFileKey = createFileKey;
exports.createFileNameAndKey = createFileNameAndKey;

exports.extractKeyFromURL = extractKeyFromURL;
exports.createURLFromKey = createURLFromKey;
