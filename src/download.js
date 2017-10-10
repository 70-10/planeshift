import downloadGitRepository from "download-git-repo";

module.exports = (repository, dir) => {
  return new Promise((resolve, reject) => {
    downloadGitRepository(repository, dir, err => {
      if (err) {
        reject("Download is failed");
        return;
      }
      resolve();
    });
  });
};
