# IYAB | إياب

A bilingual cultural heritage website developed for IT320 at King Saud University.

## Run

Extract the complete folder and open `index.html` in a browser. Keep the folder structure intact. The project can also be served using a static web server.

## Pages

- `index.html`: homepage and interactive previews.
- `timeline.html`: region and time-period selection, with food, clothing, transport, trade and leisure experiences.
- `content.html`: content catalogue, keyword search and region, period and topic filters.
- `content.html?view=admin`: content management, including bilingual entry creation, editing and deletion.
- `signup.html` and `login.html`: account interfaces.
- `account.html`: profile interface.
- `saved-trips.html`: saved journeys and resume controls.

## Current implementation

- Arabic and English interfaces with direction changes and persistent language selection.
- Interactive content for the Central region across four periods. Other regions display a coming-soon note until content is added.
- Content management and saved journeys use browser-local storage.
- Authentication is simulated. Server-side authentication, protected administrator permissions and SQL integration are not implemented in this phase.
- Browser-local data remains in the current browser and is not included when sharing the project folder. Local-file storage behavior varies across browsers.

## Project structure

- `assets/`: shared artwork and images.
- `content/`: content records, local repository and catalogue interface.
- `timeline/`: interactive experiences, their styles and assets.
- `auth.js`: account interactions and shared account-page navigation.
- `i18n.js` and `translations.js`: language selection and interface translations.
- `site-integration.js`: shared navigation and search integration.

Cultural references are linked within the content and experiences. Scenes are illustrative reconstructions; game quantities and prices are simplified for interaction.
