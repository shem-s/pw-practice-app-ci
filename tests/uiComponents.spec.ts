import test, { expect } from "@playwright/test";

// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// The below is used to run only the test in that are in this file in paralell 
// test.describe.configure({mode:"parallel"})
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

test.beforeEach(async({page})=>{
    await page.goto("/")
})


// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// The below is used to run only the test in that describe block in paralell 
// test.describe.parallel("form layouts page",async ()=>{
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

test.describe("form layouts page @block",async ()=>{
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Retries can be overriden from the playwright config file
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // test.describe.configure({retries:2})
    
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // The below runs one test after another 
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    test.describe.configure({mode: "serial"})

    test.beforeEach( async({page})=>{
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test("input fields",async ({page},testInfo)=>{
        if(testInfo){
            // do something
        }

        const usingTheGridEmailInput = page.locator("nb-card", {hasText:'Using the Grid'}).getByRole('textbox', {name:'Email'})

        await usingTheGridEmailInput.fill("test@test.com")
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.type("This is a different message")
        // await usingTheGridEmailInput.pressSequentially("This is a different message", {delay:500})

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual("This is a different message")

        // locator assertion
       await expect(usingTheGridEmailInput).toHaveValue("This is a different message") 
    })

    test("radio buttons", async({page})=>{
        const usingTheGridForm = page.locator('nb-card', {hasText:'Using the Grid'})
        // await usingTheGridForm.getByLabel('Option 1').check({force:true}) 
        // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // Use "force:true" due to the radio button being hidden (as seen in the class) of the input element of the radio button 
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        await usingTheGridForm.getByRole('radio', {name:'Option 1'}).check({force:true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked()
        expect(radioStatus).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force:true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    
    
    })

    test.only("radio buttons 2", async({page})=>{
        const usingTheGridForm = page.locator('nb-card', {hasText:'Using the Grid'})
        // await usingTheGridForm.getByLabel('Option 1').check({force:true}) 
        
        await usingTheGridForm.getByRole('radio', {name:'Option 2'}).check({force:true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name:'Option 1'}).isChecked()
        // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // The method "toHaveScreenshot()" used below will check if there is a base line image 
        // and if not it will create one on the first run
        // The screenshots will be created by project basis as different browsers may render the page slightly differently causeing errors
        // You can also add the object {maxDiffPixels:10} to the function to may the comparison less precise (the number of pixels that can be different can be any number)
        // The less precise screenshot comparisons can be used for flaky test for example
        // in the CLI (cmd line) you can use the parameter --update-snapshots to update all the baseline snapshots to the new ones
        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        await expect(usingTheGridForm).toHaveScreenshot({maxDiffPixels:250})



        // expect(radioStatus).toBeTruthy()

        // await expect(usingTheGridForm.getByRole('radio', {name: 'Option 1'})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: 'Option 2'}).check({force:true})
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    
    
    })

})

test("Checkboxes", async ({page})=>{
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    await page.getByRole('checkbox', {name:'Hide on click'}).uncheck({force:true})
    await page.getByRole('checkbox', {name:'Prevent arising of duplicate toast'}).check({force:true})
    // NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // the method "check" is used to check the check box but if it is already cheked it will not uncheck it
    // you would then need to use the "uncheck" method to do so. The same behaviour is for unchecked with en unchecked checkbox
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force:true})
        expect( await box.isChecked()).toBeFalsy()
    }


})

test('Dropdown', async ({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole("list") // when the list has a UL tag
    page.getByRole('listitem') // when the list has LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator("nb-option-list nb-option")
    await expect(optionList).toHaveText(["Light", 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({hasText:'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colours = {
        'Light':'rgb(255, 255, 255)',
        'Dark':'rgb(34, 43, 69)',
        'Cosmic':'rgb(50, 50, 89)',
        'Corporate':'rgb(255, 255, 255)'
    }

    await dropDownMenu.click()
    for(const colour in colours){
        await optionList.filter({hasText:colour}).click()
        await expect(header).toHaveCSS('background-color', colours[colour])
        if(colour != 'Corporate')
            await dropDownMenu.click()
    }
})

test('tooltips', async ({page}) =>{
    // Tooltips disapear when the cursor is moved from the element triggering the tooltip
    // In the dev tools got to the "Sources" tab and hover over the element that would trigger the tool tip press Press F8 (Windows) to freeze the browser and place it in debug mode
    // Using this you can now select the "Elements" tab and then find the element on the page that was normally disappear
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Tooltip").click()

    const toolTipCard = page.locator('nb-card', {hasText:'Tooltip Placements'})
    await toolTipCard.getByRole('button', {name:'Top'}).hover()

    page.getByRole('tooltip') //this works only if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')

})

test('dialog box', async({page}) =>{
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // The dialog box from this test is not from the page but from the browser. Playwright detectrs this browser dialog and automatically cancels it
    // We then need to tell/config playwright not to do that
    
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()

    // lets check to ensure that the first row does not have the email that was just used to delete the row
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) =>{
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    // 1 get the row by any text in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'}) 
    await targetRow.locator('.nb-edit').click()

    await page.locator("input-editor").getByPlaceholder('Age').clear()
    await page.locator("input-editor").getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()
    // const age = await targetRow.locator('.ng-star-inserted').textContent()
    // expect(age).toEqual('35')

    // 2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    // await page.locator('.ng2-smart-pagination-nav .ng2-smart-page-link',{hasText: '2'}).click()
    // "filter({has: page.locator('td')" this returns the columns of the 2 rows that were returned
    // The ".nth('1')" below is selecting the first column in the table for each row
    // ".getByText('11')" Further filters it down from the previously filtered cells to only the cell  that has "11" in it
    const targetRowById = page.getByRole('row', {name:'11'}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.click()
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator("input-editor").getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 3 test filter of the table
    const ages = ['20','30','40','200']

    for(const age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        // due to an animation on the page when the table is filtered the wrong value is grabbed
        // Hence a hard wait may need to be implemented to wait for the animation to finish then continue as playwright is moving faster than the animation
        await page.waitForTimeout(500)
        const ageRows = await page.locator('tbody tr')
        
        for(const row of await ageRows.all())
        {
            const cellValue = await row.locator('td').last().textContent()
            
            if (age === "200"){
                expect( await page.getByRole('table').textContent()).toContain('No data found')
                // OR
                // await expect( page.locator('tbody tr td')).toHaveText('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }
        }
    
    }
})

test("date picker", async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    // page.locator('nb-card', {hasText: 'Common Datepicker'}).locator('input').click()
    // OR
    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()


    const date = new Date()
    date.setDate(date.getDate() + 29)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month:'short'})
    const expectedMonth = date.toLocaleString('En-US', {month:'long'})
    // const expectedMonth = date.getMonth().toString()
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    // let currentMonth = await page.locator('nb-calendar-view-mode').textContent()
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = ` ${expectedMonth} ${expectedYear} `
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation .next-month').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }


// Note: getByText does not match exact but more so uses containts that text and does a partial match
// so in the below example if you "getByText('1')" then it will get ['1','10','11','12', ...etc]
// to specify an exact match use the below
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact:true}).click()

    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test("sliders", async({page}) => {
    // Update Attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node =>{
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

    // Mouse Movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    // box.x
    // OR
    // box.y

    // Lets find the center of the box for the stating coordinates
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down() //Holds down the left click

    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y +100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})


