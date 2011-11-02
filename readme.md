# Overview
This simple plugin aims to solve a very frustrating problem: *web forms empty their contents when a user browses away from a page.*

With simple forms, this makes little difference.  It's no big deal to retype your first or last name or your brother's girlfriend's sister's first pet's high school teacher's name.
The *real* problem is when you've just finished typing a long passionate reply to a blogger who just tore apart your favorite text editor -- and you lose your entire response by accidentally browsing away.

Flashback aims to solve this problem by saving all form input fields to local storage before unloading the page and recalling the stored data when the user revisits.

# Usage
`$(element).flashback({options})`  
To start using flashback simply add one of these snippets to the page, once the DOM is loaded.

**Save all forms**  
This will find every form element on the page and save all input, textarea, and select menus to storage.  
```$(document).flashback();```

**Save a specific form**  
This will find the form with the id of 'myForm' and save its fields.  
```$(#myForm).flashback();```

# Options
  - **autoSaveInterval** - (integer) time in milliseconds (default is 0)  
  Setup an auto-saving interval to save forms on a specific timed loop.
  
  - **autoSaveUnload** - (boolean) true/false (default is true)  
  Setup the window events to save the forms when someone unloads the page (refresh, back clicked, links clicked)
  
  - **useLocalStorage** - (boolean) true/false (default is true)  
  Whether to use HTML5 localStorage (available in most modern browsers) or cookies.  Note: If localStorage is set to true, but the browser doesn't support it flashback will degrade to using cookies.
  
  - **expires** - (integer) time in days you'd like the cookie to expire (default is nil, resulting in no expiration being set)  
  Days from time created for the cookie to expire.  Default results in no expiration.

# Methods
There may be times where you want to ask flashback to do something manually (say, a 'save' button).  We've exposed a couple methods for you to do that:  
*Note: the method will only be applied with the scope of the element it is called on.*

  - **$(element).flashback('save')**  
  Save the element's fields
  
  - **$(element).flashback('load')**  
  Load the element's fields
  
  - **$(element).flashback('clear')**  
  Clear the elements saved data from storage.

# Caveats
  -  This ***will not*** save password fields.  Since password fields are technically clear-text under the hood, we aren't about to start saving password fields to cookies and localStorage.