# 📮 Briefkasten

WIP Bookmarking application

## 🚀 Getting Started

You'll need any type of database supported by Prisma, i.e. Postgresql, Mysql, etc. I've chosen [Planetscale](https://planetscale.com) for my implementation.

For OAuth support, you'll also need any one of the [providers](https://next-auth.js.org/providers) supported by [NextAuth.js](https://github.com/nextauthjs/next-auth).

1. Clone the repository

```sh
$ git clone git@github.com:ndom91/briefkasten.git && cd briefkasten
```

2. Install dependencies

```sh
$ npm install
```

3. Copy the `.env.example` file, and fill in your copy of the environment variables.

```sh
$ cp .env.example .env
$ vim .env
```

4. Start the development server!

```sh
$ npm run dev
```

## 🔗 Bookmarklet

You can copy this <a href='javascript:{(function(){ window.fetch("http://localhost:3000/api/bookmarks/new",{method:"POST",body:JSON.stringify({url:document.location.href,user_id:"cl2xsndr00060fdbhomcxg4l8",title:document.title})})})();}'>link</a> to your bookmarks bar, to add URLs to your instance!

## 👷 Contributing

This project is open to any and all contributions! Please stick to the ESLint / Prettier settings and I'll be happy to take a look at your issue / PR 😀

## 📝 License

MIT
