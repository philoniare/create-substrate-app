---
id: folder-structure
title: Folder Structure
---

After creation, your project should look like the starter project on each respective framework. Substrate specific code
can be found under the `substrate` folder. It contains logic to connect a wallet and queries the balance of the
connected wallet on the chosen chain.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by webpack. You need to **put any JS and CSS files inside `src`**, otherwise webpack won’t see them.

Only files inside `public` can be used from `public/index.html`. Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories. They will not be included in the production build so you can use them for things like documentation.

If you have Git installed and your project is not part of a larger repository, then a new repository will be initialized resulting in an additional top-level `.git` directory.
