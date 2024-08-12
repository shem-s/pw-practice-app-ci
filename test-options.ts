// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// This is a method of creating a global variable by modifying the test object then setting it in the "playwright.config.ts" file  
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import {test as base} from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL: string
    formsLoyoutsPage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', {option: true}],

    formsLoyoutsPage: async( {page}, use)=>{
        await page.goto("/")
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()

        // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // every thing before the "use()" function below will run before the test (before each)  
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        await use('')
        // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // every thing after the "use()" function above will run after the test like a tear down (after each each)  
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    },

    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // The above works but you can further specify the desired behaviour by setting auto to true to always automatically run before a atest  
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // formsLoyoutsPage: [async( {page}, use)=>{
    //     await page.goto("/")
    //     await page.getByText("Forms").click()
    //     await page.getByText("Form Layouts").click()

    //     await use('')
    // }, {auto:true}],
    
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // By adding "formsLoyoutsPage" to the below we create a dependency and formsLoyoutsPage will now run when the pageManager fixture is run
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    pageManager: async({page, formsLoyoutsPage}, use) =>{
        const pm = new PageManager(page)
        await use(pm)
    }
    

})