# Change Log
All notable changes to the project, past revisions, are documented in this file.

### Version 0.0.4
```
+ Updated database for User_mgmt
  + Added ID, autoincrement
  + Added unique constraint
  + Updated model, api and view accordingly
+ Fixed api sending two responses on error
+ Populated database for Data_mgmt
  + Tables, relations, pkey, fkey, unique, class hierarchy, sequences
  + With the necessary permissions for nodeuser
  - Model and api not created
```

### Version 0.0.3
```
+ Added new api call path
  + Prevented default password display
+ Added new test cases
  + Improved test rendering
+ Added model associations
```

### Version 0.0.2
```
+ Major reorganisation of project structure
  + Updated file paths accordingly
+ Separated sequelize config file from postgres start script
+ Readability refractoring of group.ejs
+ Removed postgre/sequelize start delay
+ Chaining test case
```

### Version 0.0.1
```
+ Added unit testing
+ Added GNU licensing
+ Created changelog
+ Added functionalities to UserManagement->Group
  + Able to display existing groups
  + Able to add new group
  + Able to delete existing group
+ Implemented API gateway
  + Added Create
  + Added Read
  + Added Delete
  - Missing Update operation
  - Missing user authorization check
+ Unit tests for CRUD operations
```

### Version 0.0.0
```
+ Initialized base project
```
