import puppeteer from "puppeteer-extra";

export default async function getToken() {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_EXEC,
    });
    const page = await browser.newPage();
    await page.goto("https://accounts.spotify.com/en/login?continue=https:%2F%2Fopen.spotify.com%2F");
    await page.waitForSelector("#login-username");
    await page.type("#login-username", process.env.SPOTIFY_USR);
    await page.type("#login-password", process.env.SPOTIFY_PWD);
    await page.click("#login-button");
    await page.waitForNavigation();
    await page.goto("https://open.spotify.com/get_access_token?reason=transport&productType=web_player");
    const data = await page.evaluate(() => {
        return document.querySelector("pre").innerText;
    });
    await browser.close();
    const token = JSON.parse(data).accessToken;
    return token;
}