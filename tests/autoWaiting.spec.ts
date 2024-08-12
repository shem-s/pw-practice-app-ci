import {expect, test} from "@playwright/test"

test.beforeEach(async ({page}, testInfo) => {
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // This is using globals by setting them in the ".env" file 
    // however you will need to install the "dotenv" package "npm i dotenv"  OR  "npm i dotenv --save-dev --force"
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    await page.goto(process.env.URL)
    await page.getByText("Button Triggering AJAX Request").click()

    testInfo.setTimeout(testInfo.timeout + 2000)
})

test("Auto Waiting", async({page}) => {
    const successButton = page.locator('.bg-success')
    
    // // await successButton.click() 
    // // const text = await successButton.textContent()
    // await successButton.waitFor({state:"attached"})
    // const text = await successButton.allTextContents() // Does not have auto waiting feature

    // expect(text).toContain("Data loaded with AJAX get request.")

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout:20000})
})// uitestingplayground.com/ajax

test.skip("alternative waits", async ({page})=>{
    const successButton = page.locator('.bg-success')

    // ___ wait for element
    // await page.waitForSelector('.bg-success') 

    // ___ wait for particular repsonse
    // await page.waitForResponse("http://uitestingplayground.com/ajaxdata")

    // ___ wait for network calls to be completed ("NOT RECOMMENDED")
    await page.waitForLoadState("networkidle")




    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip("timeouts", async ({page})=>{
    test.slow() //This will slow down your default time out by 3 times (e.g. 10000 becomes 30000)
    test.setTimeout(10000)
    const successButton = page.locator('.bg-success')
        await successButton.click() 
        await successButton.click({timeout:16000}) 
})