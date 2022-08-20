# 📮 Briefkasten

![GitHub deployments](https://img.shields.io/github/deployments/ndom91/briefkasten/production?label=ci%2Fcd&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/ndom91/briefkasten?style=flat-square)
![Checkly](https://api.checklyhq.com/v1/badges/checks/9c682653-d7de-4e32-8183-73d76631b0e2?style=flat-square&responseTime=false)
![GitHub](https://img.shields.io/github/license/ndom91/briefkasten?style=flat-square)
[![Demo](https://img.shields.io/badge/demo-click%20here-brightgreen?style=flat-square)](https://briefkastenhq.com)

Self-hosted bookmarking application. Works with any Prisma compatible database (MySQL, Postgres, SQLite, etc.)

### Free Instance: [briefkastenhq.com](https://briefkastenhq.com) [[Docs](https://docs.briefkastenhq.com)]

## 📸 Screenshots

<table>
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/screenshot_app01.png" target="_blank"><img src="public/screenshot_app01.png"></a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/screenshot_app05.png" target="_blank"><img src="public/screenshot_app05.png"></a>
  </td>
</tr>
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/screenshot_app06.png" target="_blank"><img src="public/screenshot_app06.png"></a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/ndom91/briefkasten/main/public/screenshot_app04.png" target="_blank"><img src="public/screenshot_app04.png"></a>
  </td>
</tr>
</table>

## 🎩 Features

- Save by [Browser Extension](https://github.com/ndom91/briefkasten-extension)
- Automatic title and description extraction
- Drag-and-drop URLs on page to save
- Keyboard shortcuts
- Organise by categories and tags
- Import and export bookmarks from standard HTML format
- Bookmark image fetching [background job](https://github.com/ndom91/briefkasten-scrape)
- Multiple views
- Fulltext search
- REST API
- OAuth + Email magic link login

## 🧺 Prerequisites

To self-host this application, you'll need the following thins:

1. Server / hosting platform for a Next.js application (i.e. Vercel / Netlify)
2. For OAuth login, a developer account at any one of the [providers](https://next-auth.js.org/providers) supported by [NextAuth.js](https://github.com/nextauthjs/next-auth)
3. Database that works with Prisma (i.e. MySQL, Postgres, SQLite, etc.)
4. Image hosting space (i.e. Supabase / ImageKit / Cloudinary) (**optional**)

These are all relatively straight forward, other than the image hoster. This was chosen to avoid putting the images in the database. The example application at [briefkastenhq.com](https://briefkastenhq.com) is using [Supabase Storage](https://supabase.com), but any other similar provider like Cloudinary or a simple S3 Bucket would also do the job. I chose Supabase, because they have an easy to use SDK, a decent free tier, and I was already using their Postgres service.

After you've got an account setup at all of the above providers, or have your own infrastructure ready to go, you can continue on to the next steps below.

## 🚀 Getting Started

1. Clone the repository

```sh
$ git clone git@github.com:ndom91/briefkasten.git && cd briefkasten
```

2. Install dependencies

```sh
$ pnpm install
```

3. Copy the `.env.example` file to `.env`, and open it with your favorite text editor to fill in your environment variables.

```sh
$ cp .env.example .env
$ vim .env
```

In this environment variables file, make sure to at least fill in the `DATABASE_URL`, `NEXTAUTH_URL` and `NEXTAUTH_SECRET`. The rest of the environment variables depend on the services / features you want to use. For example, Google/Github for OAuth login and/or Supabase for object storage.

4. Start the server!

```sh
// First time only
$ pnpm db:push

// dev
$ pnpm dev

// prod
$ pnpm build
$ pnpm start
```

## 🐳 Docker

You can also self-host Briefkasten with Docker. To do so, you must:

1. Install `docker` and `docker-compose`.
2. Clone the repository and copy the `.env.example` to `.env` file.
   1. Here you also need to fill out the `DATABASE_URL` and `NEXTAUTH_*` environment variables at minimum.
   2. The `DATABASE_URL` for the postgres container should be `DATABASE_URL=postgres://bkAdmin:briefkasten@postgres:5432/briefkasten?sslmode=disable`
3. Run `docker-compose up -d` in the root of the repository. This will start the application as well as the database for you.
4. After the initial start, you still have to manually seed the database. This is most easily done through the app container (`bk-app`).
   1. Run `docker exec -it bk-app /bin/bash` to enter a terminal session inside the container.
   2. Then run `pnpm db:push` inside the container. This will push the database schema from prisma to the configured database.
5. Now your application and database should be up and running at the default `http://localhost:3000`

## 🕸 Related

<img src="public/screenshot_ext.png" align="right" />

### 📲 Save from Android Share Menu

With this open-source application [HTTP Shortcuts](https://http-shortcuts.rmy.ch/), you can create a "Share Menu" item which executes a `POST` request with dynamic input, i.e. a web page's URL and title. This makes it super easy to share items from your phone to Briefkasten! More information in the [docs](https://docs.briefkastenhq.com/docs/getting-started.html#http-shortcuts-android).

### 🌍 Browser Extension

There is a companion browser extension in the works which you can use to add websites to your vault while browsing the web. It can be found at [`ndom91/briefkasten-extension`](https://github.com/ndom91/briefkasten-extension). It is currently not published on any of the Browser Extension Stores, but can be built locally and loaded as a development extension in any Chromium based browser. More details in that repository.

### 🧑‍🏭 Screenshot Job

There is also a background job to fill in bookmarks which do not have a valid image. It can be found in the [`ndom91/briefkasten-scrape`](https://github.com/ndom91/briefkasten-scrape) repository. This job runs every 2 hours in a Github Action and processes 10 bookmarks at a time.

## 👷 Contributing

This project is open to any and all contributions! Please stick to the ESLint / Prettier settings and I'll be happy to take a look at your issue / PR 😀

## 📝 License

MIT
