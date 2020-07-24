# Change Log
All notable changes to the project, past revisions, are documented in this file.

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

### Version 0.0.7
```
+ API now requires login
+ Sorted general CSS
+ Mass changes to storage/files
  + Full folder functionality
  + Full regular_file functionality
  - Permissions functionality not implemented
  + UI updates
  + Mobile compatible UI
  - Groups/Files/Folders api access control not implemented
+ Added user guide
```

### Version 0.0.6
```
+ Improved sidebar style
  + Added logo
+ Added global attributes propogation
  + request filtering middleware
+ Added Modals
+ UI functionality
  + Complete for Group Managment
  - Missing User Management
  - Missing data controls
```

### Version 0.0.5
```
+ Final Database revisions for user_mgmt and data_mgmt
+ Added data_mgmt models
+ user_mgmt api completed
  - Lacking crud tests
+ data_mgmt api completed
  - Lacking crud tests
+ Added graphical login page
+ Added users datatables
```

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
