import {test} from "@playwright/test"
import { PageManager } from "../page-objects/pageManager"
// import {NavigationPage} from "../page-objects/navigationPage"
// import {FormLayoutsPage} from "../page-objects/formLayoutsPage"
// import { DatepickerPage } from "../page-objects/datePickerPage"

import {faker} from "@faker-js/faker"

import { argosScreenshot } from "@argos-ci/playwright";

test.beforeEach(async({page})=>{
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // The commented out code is basic navigation but below that is when you set the baseURL in the "playwright.config.ts" file
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // await page.goto("http://localhost:4200/")
    await page.goto("/")
})

// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Adding "@smoke" to tje tittle of the test like below adds a tag to the test
    // which can then be used in the cmd line interface(CLI) by adding "--grep=@tagName on windows" 
    // and in this case it will be "--grep=@smoke"
    // to run test with different tag names use the following  '--grep --% "@tag1^|@tag2'
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
test('navigate to the form page @smoke', async ({page})=>{
    const pm = new PageManager(page)
    // const navigationTo = new NavigationPage(page)

    
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTable()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parameterized methods @smoke', async({page}) =>{
    const pm = new PageManager(page)
    // const navigationTo = new NavigationPage(page)
    // const onFormLayoutsPage = new FormLayoutsPage(page)
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // You can use faker to randomize your test and help not to reuse test data
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const randomFullname = faker.person.fullName()
    const randomEmail = `${randomFullname.replace(' ','')}${faker.number.int(1000)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption("test@test.com", 'Welcome1', 'Option 1')
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Screenshot the page 
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    await page.screenshot({path:'screenshots/formsLayoutsPage.png'})

     // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Screenshot the page and store as a binary
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    const buffer = await page.screenshot()
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullname, randomEmail, true)
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Screenshot just a segment of the page via an element 
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    await page.locator('nb-card', {hasText:'Inline Form'}).screenshot({path:'screenshots/inLineForm.png'})
})

test('datepicker', async ({page})=>{
    const pm = new PageManager(page)
    
    // const navigateTo = new NavigationPage(page)
    // const datepickerPage = new DatepickerPage(page)
    
    await pm.navigateTo().datepickerPage() 
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(5,7)
})

test.only('testing with argos ci', async ({page})=>{
    const pm = new PageManager(page)
    
    await pm.navigateTo().formLayoutsPage()
    await argosScreenshot(page, 'form layout page')
    await pm.navigateTo().datepickerPage()
    await argosScreenshot(page, 'date picker page')

    /* Use the below site/service to setup Screenshot testing in the CI (screenshots are sent here)
     There is a free version
     https://app.argos-ci.com/
     Use the below URL to see data on setting it up with your project:
     https://argos-ci.com/docs/quickstart/playwright   
    
    
     */
})