import {test, expect} from "@playwright/test"



test("input fields",async ({page},testInfo)=>{
    
    await page.goto("/")

    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // You can use the below to check if it is a mobile device and have conditional code to help match the layout,
    //  as elements in mobile views can vary from elements in the desktop view
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    if(testInfo.project.name === 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
    if(testInfo.project.name === 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }

    const usingTheGridEmailInput = page.locator("nb-card", {hasText:'Using the Grid'}).getByRole('textbox', {name:'Email'})

    await usingTheGridEmailInput.fill("test@test.com")
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.type("This is a different message")

    
})