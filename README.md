# Warframe Hub

[![Greenkeeper badge](https://badges.greenkeeper.io/WFCD/warframe-hub.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.com/WFCD/warframe-hub.svg?branch=dev)](https://travis-ci.com/WFCD/warframe-hub) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9e3152d74ab44e78a8e5a42c3de9e836)](https://www.codacy.com/app/MainlandHero/warframe-hub?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=WFCD/warframe-hub&amp;utm_campaign=Badge_Grade)

[![Supported by Warframe Community Developers](https://warframestat.us/wfcd.png)](https://github.com/WFCD "Supported by Warframe Community Developers")

## Prerequisite
In order to run your own version of Warframe Hub, you are required to have the following on your machine:
 * [Node > 10.13.0](https://nodejs.org/en/) for running the project
 * [NPM > 6.4.1](https://www.npmjs.com/get-npm) for dependency control, usually installed with Node.js

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
$ npm start
```

You can develop the application through the Vue UI, which you can install through `npm i -g @vue/cli`

The Vue dashboard will be accessible at http://localhost:8000

## Bug/Issue Report
Found a bug or an issue? Please submit a bug/issue report under the [issue tab](htps://github.com/wfcd/warframe-hub/issues).

## Testing
Our builds goes through Travis-CI's tester.

You can see the latest results [here](https://travis-ci.com/WFCD/warframe-hub) or by clicking on the badge at the top of the page.

Nodemon is no longer needed as vue comes with its own hot reloader.

## License
The distribution of this software is protected under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Small Note
Like most projects, Warframe Hub is purely out of passion, love, and dedication to the Warframe Community and open source software in general. This is not my full time job, and probably will never be. No donations will be encouraged because once a person starts to receive payments for a passion project, is it still a passion?
