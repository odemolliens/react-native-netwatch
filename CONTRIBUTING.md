# Contributing to React-native-netwatch

## Branch naming policy

All branch in this project **must** comply with the following patterns:

```
- fix/<branch_name> (e.g.: fix/my-fix)
- feat/<branch_name> (e.g.: feat/my-feature)
```

## Pull request policy

In order to contribute to this project you need to open a pull request for a branch and mention as title explicitly the content of the branch.

Pull request who are not compliant with this policy **will** be closed immediately.

All conflict **must** be resolved in the `source branch` before starting any review/merging activity.

## Android
Make sure the following conditions ar respected:

- Code is compiling.

## iOS
Make sure the following conditions ar respected:

- Code is compiling.

## React Native
Make sure the following conditions ar respected:

- Clean code rules are followed:
    - Your code must pass the `yarn run lint` checks.
    - Your code must pass the `yarn run tsc` checks.
    - Your code must pass the `yarn run prettier:check` checks.
- Unit tests are added/adapted for the introduced changes:
    - Unit tests can be run locally with `yarn run testu`.
    - If your changes break the coverage threshold, you must update the test accordingly.
        - **IMPORTANT**: the unit test must be updated, not the code to conveniently reach the threshold!
