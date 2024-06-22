# Reporting an Issue
We use Github issues to track issues with MCCreations. If you've found a bug or issue with MCCreations, start here!
### Creating a Bug Report
If you've found a bug with MCCreations that does not involve a security vulnerability, first search the current issues on Github to make sure someone hasn't already found it. If there are no open issues that seem to match the issue you are having, your next step is to open a new issue. 

First, go to the Issues tab of the MCCreations Next Github Repository (you're already part of the way there!). Once you're there, press the green "New Issue" button in the top right corner. We've provided some issue templates for basic issues you might encounter with MCCreations, please try and use these templates if possible. **All Issues should include a title and clear description of the problem**. If you can, include videos, code samples or tests showing the problem occurring or where the issue arises as well as information about your computer. Your goal should be to make it as easy as possible for others to reproduce and fix your issue.

When you first open an issue, you probably won't see any activity or receive feedback right away. We're a really small team and it takes us time to look over new issues and diagnose them. Know that we do see your bug and are working our hardest to fix it. You may also work to solve the issue yourself or with the community!

### Feature Requests
Github issues aren't a great place for feature requests, so please do not put them there. Instead, feel free to reach out on our Discord community to request help and get community feedback, or create the feature yourself and make a Pull Request. We are always open and reading your suggestions on Discord so don't worry about not being seen!

# Resolving Existing Issues
If you want to help out with MCCreations in other ways than just reporting bugs, the most helpful thing you can do is help resolve existing issues. This is also a great way to get more comfortable with the MCCreations codebase before creating feature requests.

### Verifying Bug Reports
Simply verifying that a bug report is true is extremely helpful. If you're experiencing the same issue as someone else, leave a comment on the issue saying so! If the issue is lacking information or has too few or too many reproduction steps you can help by contributing additional information. If the issue doesn't have any media showing how to recreate the issue, add your own!

### Testing Pull Requests
Another way you can help is by testing and/or examining code contributed by other people or our team members. When doing so, consider:
- Does the change actually work?
- Is the code decently well documented?
- Is the implementation well done?
Once you're happy with a pull request or you want to indicate some problems, leave a comment on the request indicating what you found. You should mention specifically what you do and do not like about the PR otherwise we will not take your comment seriously

# Contributing to MCCreations Next
### Setting Up
MCCreations Next requires both Node.js and NPM to be installed on your machine. Installation and instructions can be found [here](https://nodejs.org/en)

### Cloning the Repository
Building directly on top of the existing MCCreations repository is not recommended. To clone the repository, first create a new fork, and then clone that fork to your local machine. You can use the Github CLI, Desktop App or any other Git compatible applications to do this.

### Install Dependencies
Run 
```
$ npm install
```

### Running MCCreations Next
To test your changes run:
```
$ npm run dev
 ```
*Since some operations require security keys not all operations will function on your local machine. At this time, only uploading new files is not supported*

### Writing Code
When making changes to MCCreations, keep these things in mind:
- Adhere to our style conventions as best as possible
- Test, test, test, test
- Update documentation if there is any surrounding your change, or add your own

### Building
Before creating a pull request on MCCreations, you must first build your changes to make sure they work in a production environment.
```
$ npm run build
```

### Committing Changes
When you're happy with the changes you've made, commit them to your fork of the repository. A good commit should look something like this:
```
Short Summary (about 50 characters or less)

Detailed Description of the changes if needed. This may seem redundant,
but anything you can do to help other people understand your code better
is one step closer to getting your changes merged
```
### Creating a Pull Request
[Create a PR with this guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)




