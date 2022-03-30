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
      fs.unlink(path.join(DIR, file), (err) => {
        if (err) throw err;
      });
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
  "---\n\nlayout: post\ntitle: Setting up this template\ndate: 2021-11-14 13:00:00 +0530\ncategories: guide\nexcerpt: This excerpt will show up in blog list\n\n---\nSetting up your blog with this template is easy peasy.\n- Clone the [repo](https://github.com/rishimohan/rishimohan.me)\n- Run `yarn install` and then `node ./scripts/clean` to start fresh\n- Edit this blog post in `./data/blog`\n- To add a new blog post, create a `.md` file in `./data/blog` with the following format:\n\n```---\nlayout: post\ntitle: Setting up this template\ndate: 2021-11-14 13:00:00 +0530\ncategories: guide\nexcerpt: This excerpt will show up in blog list\n\n---\nContent```"
);

fs.writeFileSync(
  "./data/projects/first-project.md",
  "---\n\ndate: 2021-04-23 21:11:00 +0530\nslug: first-project\ntitle: First Project\nweb: https://projecturl.com\ntech: [Next.js, TailwindCSS, Supabase]\nicon: /images/work/show/kizie-icon.png\n\n---\nYou can edit this file in `./data/projects/first-project.md`."
);

fs.writeFileSync(
  "./pages/index.js",
  "export default function Home() {\nreturn (\n<div className='w-full px-10 py-10 mb-20 overflow-y-auto max-w-[620px] mx-auto'g>\n<h1 className='text-4xl font-black mb-2'>Hi, I'm _____!</h1>\n<p>Write about yourself here.</p>\n</div>\n);\n}"
);
