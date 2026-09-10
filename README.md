# [WiiMart.org](https://wiimart.org)

<img src="media/branding-bag-no-bg.png" width="100" align="right">

This is the source code of WiiMart's website. It contains WADs, branding, and project information.

## Content pages
* `credits.html` Credits for WiiMart
* `dlc.html` DLC guide
* `fishiemart.html` ;D
* `index.html` Main page
* `info-log.html` 'Important Info' log
* `install.html` Installation guide
* `specials.html` Goodies from the team
* `support.html` Support/FAQ page

### Meta
* `/extras` Files used for the Specials page (Themes, forwarders)
* `/media` Media files used throughout the site (pictures, branding, sound effects)
* `/meta` Files used for the website (CSS, JS, images, music)
* `/patcher` Files used for the DLC patcher
* `/wad` WAD files (patched IOS and shop)
* `/news-service-java` Tomcat news feed and Discord-compatible ingestion service
* `/discord-bot` Administrator-only announcement slash command and news publisher
* `/scripts` archive extraction and project validation tools
* `CNAME` Website domain for GitHub Pages
* `favicon.ico` Favicon
* `404.html` 404 page

### Redirects

* `errors.html` Redirect for `support.html`
* `title-sheet.html` Redirect for `titles.html`

## Development

With Node.js 20.19 or newer, run `npm install` and `npm run bot:install` once, then use `npm test` to validate the HTML, local links, scripts, preserved page text, title data, news archive, and announcement bot. Run `npm run news:test` with Maven and Java 17 or newer to test the Tomcat service.

The Tomcat deployment instructions for `news-api.wiimart.org` are in the news service package.

The Discord announcement bot setup is in [`discord-bot/README.md`](discord-bot/README.md).

*The WiiMart Team is not affiliated with Nintendo or any related parties.*
