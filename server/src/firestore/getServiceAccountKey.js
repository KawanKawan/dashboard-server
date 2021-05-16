/**
 * When running on non-gcp cloud provider infra, use this to read service account key either from ENV or file
 * @function getServiceAccountKey
 * @returns {Object} service account key object
 */
module.exports = function getServiceAccountKey() {
  // If env var for default credentials set, and is a JSON string, parse and return
  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    process.env.GOOGLE_APPLICATION_CREDENTIALS.charAt(0) === "{"
  )
    return JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

  // If inside env var, and is a JSON string, parse and return
  if (
    process.env.serviceAccountKey &&
    process.env.serviceAccountKey.charAt(0) === "{"
  )
    return JSON.parse(process.env.serviceAccountKey);

  /**
   * Else usually when running service locally
   *
   * Use path specified in env var to find service account key file,
   * Else assuming in node_modules dir, traverse up to get file that should be placed in root dir
   */
  const serviceAccountFilePath =
    process.env.serviceAccountKeyPath ||
    require("path").join(process.cwd(), "serviceAccountKey.json");

  console.log(serviceAccountFilePath);

  // Inner import of fs module as only used conditionally
  // Use require to load and parse file into an object
  if (require("fs").existsSync(serviceAccountFilePath)) {
    return require(serviceAccountFilePath);
  } else
    throw new Error(`Service Account Key not at: "${serviceAccountFilePath}"`);
};
