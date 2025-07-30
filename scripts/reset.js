const fs = require("fs");
const path = require("path");

const DATA_DIR = [
  "./data/blog",
  "./data/projects",
  "./pages/experiments",
];
const ASSETS_DIR = [
  "./public/images/experiments",
  "./public/images/pages",
  "./public/images/site",
  "./public/images/work",
  "./public/images/posts",
];
const FILES_TO_DELETE = ["./pages/map.js"];

// Reset data
for (const DIR of DATA_DIR) {
  fs.readdir(DIR, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      const filePath = path.join(DIR, file);
      if (filePath.startsWith(path.resolve(DIR))) { // Ensure the file path is within the directory
        fs.unlink(filePath, (err) => {
          if (err) throw err;
        });
      }
    }
  });
}

for (const DIR of ASSETS_DIR) {
  fs.rm(DIR, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}

for (const FILE of FILES_TO_DELETE) {
  try {
    fs.unlinkSync(FILE);
  } catch(err) {
    console.error(err)
  }
}

// Fill dummy data
fs.writeFileSync(
  "./data/blog/setting-blog.md",
  "---\n\nlayout: post\ntitle: Setting up this template\ndate: 2021-11-14 13:00:00 +0530\ncategories: guide\nexcerpt: This excerpt will show up in blog list\n\n---\nSetting up your blog with this template is easy peasy.\n- Clone the [repo](https://github.com/rishimohan/rishimohan.me)\n- Run `yarn install` and then `node ./scripts/clean` to start fresh\n- Edit this blog post in `./data/blog`\n- To add a new blog post, create a `.md` file in `./data/blog` with the following format:\n\n
