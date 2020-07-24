# QuickStart

![build](https://img.shields.io/badge/build-passing-brightgreen) ![dependencies](https://img.shields.io/badge/dependencies-latest-brightgreen) [![license](https://img.shields.io/badge/license-GPL%20v3-blue)](https://www.gnu.org/licenses/gpl-3.0)

## Description

QuickStart is a sports data management solution for sports institutions to easily manage their athlete's data.

## Features

- User management
- Data storage
- Data visualisation
- Data import/export

## Deployment

### View on Heroku

Our app can be viewed on heroku at [https://quickstart-datamanager.herokuapp.com/](https://quickstart-datamanager.herokuapp.com/)

### Deploy from zipfile (Windows)

- Download and install nodejs
- Download zipfile [24 May](https://drive.google.com/file/d/1OdouPIk8n-BRW2tIRmN9nT4a7RI--VcN/view) [31 May](https://drive.google.com/file/d/1c_XkkagLiHwEOL5JImbZ6u6J3ekGmMjH/view?usp=sharing) [23 June](https://drive.google.com/file/d/1c_XkkagLiHwEOL5JImbZ6u6J3ekGmMjH/view?usp=sharing) [29 June](https://drive.google.com/file/d/1sVudqLOzZ7CUZyOXpw44UrqktO-JdAu8/view?usp=sharing)
- Unzip the file and open a command prompt at the root directory
- Run `npm install`
- Run `npm start`
- Open your web browser and browse to [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

### Deploy from github (Windows)

- Download and install nodejs
- Clone the git project into your workfolder
- Open a command prompt at the root directory of the git project
- Run `npm install`
- Run `npm start`
- Open your web browser and browse to [http://127.0.0.1:3000/](http://127.0.0.1:3000/)

## Technology Stack

- [EJS](https://ejs.co/)
- [Express](https://expressjs.com/)
- [Nodejs](https://nodejs.org/en/)
- [PostgreSQL](https://www.postgresql.org/)

## Latest Changes

### Version 0.0.8
```
Storage->Files
  + Adapted to use ReactJS and JSX
  + Able to change islocked attribute
  + Able to add/remove user permissions
  + Able to add/remove group permissions
  - Permissions not enforced
Admin->Permission (New)
  + Able to view existing permissions
```

The complete list is available [here](CHANGELOG.md).

## License

- [GNU GPL v3](LICENSE)
