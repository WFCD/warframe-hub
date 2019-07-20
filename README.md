# Warframe Hub

[![Build Status](https://travis-ci.com/WFCD/warframe-hub.svg?branch=dev)](https://travis-ci.com/WFCD/warframe-hub) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9e3152d74ab44e78a8e5a42c3de9e836)](https://www.codacy.com/app/MainlandHero/warframe-hub?utm_source=github.com&utm_medium=referral&utm_content=WFCD/warframe-hub&utm_campaign=Badge_Grade)
[![Supported by the Warframe Community Developers](https://img.shields.io/badge/Warframe_Comm_Devs-supported-blue.svg?color=2E96EF&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOTgiIGhlaWdodD0iMTczIiB2aWV3Qm94PSIwIDAgMjk4IDE3MyI%2BPHBhdGggZD0iTTE4NSA2N2MxNSA4IDI4IDE2IDMxIDE5czIzIDE4LTcgNjBjMCAwIDM1LTMxIDI2LTc5LTE0LTctNjItMzYtNzAtNDUtNC01LTEwLTEyLTE1LTIyLTUgMTAtOSAxNC0xNSAyMi0xMyAxMy01OCAzOC03MiA0NS05IDQ4IDI2IDc5IDI2IDc5LTMwLTQyLTEwLTU3LTctNjBsMzEtMTkgMzYtMjIgMzYgMjJ6TTU1IDE3M2wtMTctM2MtOC0xOS0yMC00NC0yNC01MC01LTctNy0xMS0xNC0xNWwxOC0yYzE2LTMgMjItNyAzMi0xMyAxIDYgMCA5IDIgMTQtNiA0LTIxIDEwLTI0IDE2IDMgMTQgNSAyNyAyNyA1M3ptMTYtMTFsLTktMi0xNC0yOWEzMCAzMCAwIDAgMC04LThoN2wxMy00IDQgN2MtMyAyLTcgMy04IDZhODYgODYgMCAwIDAgMTUgMzB6bTE3MiAxMWwxNy0zYzgtMTkgMjAtNDQgMjQtNTAgNS03IDctMTEgMTQtMTVsLTE4LTJjLTE2LTMtMjItNy0zMi0xMy0xIDYgMCA5LTIgMTQgNiA0IDIxIDEwIDI0IDE2LTMgMTQtNSAyNy0yNyA1M3ptLTE2LTExbDktMiAxNC0yOWEzMCAzMCAwIDAgMSA4LThoLTdsLTEzLTQtNCA3YzMgMiA3IDMgOCA2YTg2IDg2IDAgMCAxLTE1IDMwem0tNzktNDBsLTYtNmMtMSAzLTMgNi02IDdsNSA1YTUgNSAwIDAgMSAyIDB6bS0xMy0yYTQgNCAwIDAgMSAxLTJsMi0yYTQgNCAwIDAgMSAyLTFsNC0xNy0xNy0xMC04IDcgMTMgOC0yIDctNyAyLTgtMTItOCA4IDEwIDE3em0xMiAxMWE1IDUgMCAwIDAtNC0yIDQgNCAwIDAgMC0zIDFsLTMwIDI3YTUgNSAwIDAgMCAwIDdsNCA0YTYgNiAwIDAgMCA0IDIgNSA1IDAgMCAwIDMtMWwyNy0zMWMyLTIgMS01LTEtN3ptMzkgMjZsLTMwLTI4LTYgNmE1IDUgMCAwIDEgMCAzbDI2IDI5YTEgMSAwIDAgMCAxIDBsNS0yIDItMmMxLTIgMy01IDItNnptNS00NWEyIDIgMCAwIDAtNCAwbC0xIDEtMi00YzEtMy01LTktNS05LTEzLTE0LTIzLTE0LTI3LTEzLTIgMS0yIDEgMCAyIDE0IDIgMTUgMTAgMTMgMTNhNCA0IDAgMCAwLTEgMyAzIDMgMCAwIDAgMSAxbC0yMSAyMmE3IDcgMCAwIDEgNCAyIDggOCAwIDAgMSAyIDNsMjAtMjFhNyA3IDAgMCAwIDEgMSA0IDQgMCAwIDAgNCAwYzEtMSA2IDMgNyA0aC0xYTMgMyAwIDAgMCAwIDQgMiAyIDAgMCAwIDQgMGw2LTZhMyAzIDAgMCAwIDAtM3oiIGZpbGw9IiMyZTk2ZWYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg%3D%3D)](https://github.com/WFCD/banner/blob/master/PROJECTS.md)
[![Discord](https://img.shields.io/discord/256087517353213954.svg?logo=discord)](https://discord.gg/jGZxH9f)

## Prerequisite

In order to run your own version of Warframe Hub, you are required to have the following on your machine:

- [Node > 10.13.0](https://nodejs.org/en/) for running the project
- [NPM > 6.4.1](https://www.npmjs.com/get-npm) for dependency control, usually installed with Node.js

## Dependencies

Most software related dependencies should be managed by NPM, and will be automatically installed when you try to run the project. We'll cover those dependencies in the following section.

Warframe Hub also relies on the availability of the internet, as it will parse the Warframe WorldState. It uses a slightly easier to parse WorldState provided by [Warframe Stat.us](https://docs.warframestat.us/), [API](https://api.warframestat.us).

## Installation

Clone or download and unpack this repository. Install the dependencies using NPM

```bash
$ npm i
```

If everything goes well, it should tell you the number of packages it has installed. Then you can try to run it and hope everything goes well.

```bash
$ npm run build
$ npm start
```

The website will be available for viewing at http://localhost:3000

## Development

This website runs on Vue.js, and it does come with a development server that refreshes when it detects code changes. Nodemon is no longer needed as vue comes with its own hot reloader. You can launch the development server using:

```bash
$ npm run serve
```

You can also develop the application through the Vue UI, which you can install through `npm i -g @vue/cli`

The Vue dashboard will be accessible at http://localhost:8000

## Bug/Issue Report

Found a bug or an issue? Please submit a bug/issue report under the [issue tab](htps://github.com/wfcd/warframe-hub/issues).

## Testing

Our builds goes through Travis-CI's tester.

You can see the latest results [here](https://travis-ci.com/WFCD/warframe-hub) or by clicking on the badge at the top of the page.

## License

The distribution of this software is protected under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). If the legal language in the original document is too scary for you, you can view a plain-English version of Apache License which outlines what you can and cannot do with this project [HERE](<https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)>)

## Small Note

Like most projects, Warframe Hub is purely out of passion, love, and dedication to the Warframe Community and open source software in general. This is not our time job, and probably will never be. No donations will be encouraged because once a person starts to receive payments for a passion project, is it still a passion?
