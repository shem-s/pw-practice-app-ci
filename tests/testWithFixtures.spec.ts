import {test} from "../test-options"
import {faker} from "@faker-js/faker"

// test.beforeEach(async({page})=>{
//     await page.goto("/")
// })


test('parameterized methods', async({page, pageManager}) =>{
    const randomFullname = faker.person.fullName()
    const randomEmail = `${randomFullname.replace(' ','')}${faker.number.int(1000)}@test.com`

    // await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(randomEmail, 'Welcome1', 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullname, randomEmail, true)
    await page.locator('nb-card', {hasText:'Inline Form'}).screenshot({path:'screenshots/inLineForm.png'})
})
