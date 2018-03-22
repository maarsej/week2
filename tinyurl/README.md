# TinyURL by Jacob Maarse

This project was created as part of the requirement for compeleting lighthouse labs' web development bootcamp. At its root this program is an express server that handles requests. The scope of these requests include navigating a small html website in order to give URLs to be shortened. These shortened versions can then be input and will redirect the user to their original URL. Usage is restricted behind a login/registration but rest assured all the cookies and passwords are protected behind encryption and hashing respectively! Upon logging in a user will be able to view their list of personal URLs, update/delete them or navigate to them.

## Getting Started

Upon cloning this respository simply change your directory to the project file 'tinyurl' and run the express_server.js file in node. Since the data base is coded into the js file cookies/cached browser data may need to be clear if the program is restarted. In order to see a full commit/version history navigate one folder up in the repository ('week2') as this folders name was changed mid project to something more appropriate/descriptive.

### Prerequisites

All prerequisite software except Node.js is included in the package.json provided. Simply 'npm install' before attempting to run the program.
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override

### Getting Started

```
npm install
```
```
node express_server.js
```
### Final Product

A brief overview of the layout of some of the pages:
#### The login page
!["Screenshot of login page"](https://github.com/maarsej/week2/blob/master/tinyurl/docs/Screen%20Shot%202018-03-21%20at%208.46.10%20PM.png?raw=true)
#### The user's URL list
!["Example of how a users URL list could look "](https://github.com/maarsej/week2/blob/master/tinyurl/docs/Screen%20Shot%202018-03-21%20at%208.45.48%20PM.png?raw=true)

Make sure all URLs added include at least a  // prefix or a full http://


### Stretch
Added method-override in order to allow usage of the proper method request in the forms. For example: put/delete requests in the instances of updating a url or deleting a url respectively.
