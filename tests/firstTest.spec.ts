import {expect, test} from "@playwright/test"

test.beforeEach(async ({page}) => {
    await page.goto("/")
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
})

test("Locator syntax rules", async ({page}) => {
    // by tag name
    page.locator('input')
    // The above will result in multiple elements being found. In cases like these you can use the below example
    await page.locator('input').first().click()

    // by ID
    page.locator("#inputEmail1")

    // by calss value
    page.locator(".shape-rectangle")

    // by attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    // by XPath (NOT RECOMENDED)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})


test('User facing locators', async ({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel("Email").first().click()

    await page.getByPlaceholder("Jane Doe").click()

    await page.getByText("Using the Grid").click()

    // await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignInn').click()
})


test("Locating child elements", async ({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 1")')
    // The two above lines are doing the exact same thing, but are just different ways of writing it 

    // you can mix locator methods like the below
    await page.locator('nb-card').getByRole('button', {name:"Sign in"}).first().click()


    // try to avoid the below of using the nth() method or the first() method as elements may move on the page. Try to find more precise locators
    await page.locator("nb-card").nth(3).getByRole('button').click()
})


test('locating parent elements', async ({page})=> {
    await page.locator('nb-card', {hasText:"Using the Grid"}).getByRole("textbox", {name:"Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole("textbox", {name:'Email'}).click()


    await page.locator("nb-card").filter({hasText:"Using the Grid"}).getByRole("textbox", {name: "Email"}).click()
    await page.locator("nb-card").filter({has: page.locator('.status-danger')}).getByRole("textbox", {name:"Password"}).click()

    await page.locator("nb-card").filter({has: page.locator("nb-checkbox")}).filter({hasText: "Sign in"}).getByRole("textbox", {name: "Email"}).click()

    // The Below is NOT Recommended, as te second locator is using an xpath
    await page.locator(':text-is("Using the Grid")').locator("..").getByRole('textbox', {name: 'Email'}).click()
})

test("Reusing the locators", async({page})=>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole( "textbox", {name: 'Password'}).fill('Welcome123')
    await basicForm.locator("nb-checkbox").click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue("test@test.com")
})


test("extracting Values", async({page})=>{
    // single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator("button").textContent()
    expect(buttonText).toEqual("Submit")

    // All text values
    const allRadioButtonLabels = await page.locator("nb-radio").allTextContents()
    expect (allRadioButtonLabels).toContain("Option 1")

    // Input value
    const emailField = await basicForm.getByRole('textbox', {name:"Email"})
    await emailField.fill("test@test.com")
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual("test@test.com")

    // Attributes
    const placeholderValue = await emailField.getAttribute("placeholder")
    expect(placeholderValue).toEqual('Email')
})

test("assertions", async ({page}) => {
    // General assertions

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator("button")
    
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // Locator assertion
    await expect(basicFormButton).toHaveText("Submit")

    // Soft assertion (Not considered best practice)
    await expect.soft(basicFormButton).toHaveText("Submit")
    await basicFormButton.click()
})

