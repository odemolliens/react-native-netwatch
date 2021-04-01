# Changelog (Current version: 1.2.3)

### Version 1.2.3

News
- Some bugfixes and code improvements

### Version 1.2.2

News
- Show stats between success/warning/failure requests
- Log connectivity change
- Can customize redux action to view them easily on Netwatch

New props:
- `showStats`: to display/hide stats indicator
- `reduxConfig`: to customize redux cells on Netwatch

### Version 1.1.0

News
- Add an item when the connection status change
- Display json responses as a json tree in detail page
- Netwatch can be displayed via:
    - The shake event (per default)
    - `visible` props, to display/hide via an external button .eg

New props:
- `visible`: to display/hide Netwatch without the shake event
- `onPressClose`: action which will be called when the user will press the exit button

### Version 1.0.3

Improvements
- Use okhttp version from app side via `okhttpVersion` key (android)
- Some bugfixes

### Version 1.0.0
- Library created
