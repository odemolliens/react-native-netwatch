# Changelog

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
