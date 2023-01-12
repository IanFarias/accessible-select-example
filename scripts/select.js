
const optionList = ['Relevância', 'Maiores descontos', 'Menor preço', 'Maior preço', 'Novidades']

const BASE_ID = 'option-'
const OPEN_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', ' ']
const CLOSE_KEYS = ['Escape']
const NAVIGATION_KEYS = {
    down: 'ArrowDown',
    up: 'ArrowUp'
}

const maxIndex = 4

const select = document.querySelector('#select');
const selectLabel = document.querySelector('#select-label')
const listbox = document.querySelector('[role=listbox]');

let selectedOptionId = BASE_ID + 0
let focusedOption = null

function createOption(optionName, index) {
    const option =  document.createElement('li')
    option.id = `${BASE_ID + index}`
    option.innerText = optionName
    option.classList.add('option')
    option.setAttribute('role', 'option')
    option.setAttribute('aria-selected', `${index === 0 ? 'true' : 'false'}`)
    
    option.addEventListener('click', ({target}) => {
        setSelectOption(target)
        closeSelect(select)
    })

    return option
}

function setSelectOption(selectedOption) {
    const previousOption = document.querySelector(`#${selectedOptionId}`)

    if(selectedOptionId !== selectedOption.id) {
        previousOption.setAttribute('aria-selected', 'false')
        previousOption.classList.remove('option-focused')
    
        selectedOptionId = selectedOption.id

        selectedOption.setAttribute('aria-selected', 'true')
        handleChangeValue(selectedOption.innerText)
    }
}

function handleChangeValue(value) {
    select.innerHTML = value
    select.setAttribute('data-value', value)
}

function isSelectOpen(target) {
    const ariaExpanded = target.getAttribute('aria-expanded')

    return ariaExpanded === 'true' ? true : false
}

function openSelect(target) {
    target.setAttribute('aria-expanded', 'true')
    focusedOption = 'option-0'
    target.setAttribute('aria-activedescendant', focusedOption);
}

function closeSelect(target) {
    target.setAttribute('aria-expanded', 'false')
    focusedOption = 'option-0'
}

function handleOpenSelected({key, inputSelect}) {
    const currentIndex = parseInt(focusedOption.split('-')[1]) 

    if(CLOSE_KEYS.includes(key)) {
        closeSelect(inputSelect)
        return
    }

    if(key === NAVIGATION_KEYS.down) {
        const next = Math.min(maxIndex, currentIndex + 1);
        
        inputSelect.setAttribute('aria-activedescendant', `${BASE_ID + next}`)
        focusedOption = `${BASE_ID + next}`
        handleFocus(inputSelect.getAttribute('aria-activedescendant'))
        return
    } 

    if(key === NAVIGATION_KEYS.up) {
        const previous = Math.max(0, currentIndex - 1);
        inputSelect.setAttribute('aria-activedescendant', `${BASE_ID + previous}`)
        focusedOption = `${BASE_ID + previous}`
        handleFocus(inputSelect.getAttribute('aria-activedescendant'))
        return
    }

    setSelectOption(handleSelectedOption(focusedOption))
    closeSelect(inputSelect)
}

function handleSelectedOption(id) {
    const selectedOption = document.querySelector(`#${id}`)

    return selectedOption
}

function handleFocus(id) {
    const previousOption = document.querySelector('li.option-focused')
    const currentOption = document.querySelector(`#${id}`)

    if(previousOption) {
        previousOption.classList.remove('option-focused')
    }
    
    currentOption.classList.add('option-focused')
}

function handleKeyboardAction(key, target) {
    if(OPEN_KEYS.includes(key) && !isSelectOpen(target)) {
        openSelect(target)
        handleFocus(target.getAttribute('aria-activedescendant'))
        return
    }

    if(isSelectOpen(target)) {
        handleOpenSelected({key, inputSelect: target})
        return
    }
}


window.addEventListener('load', () => {
    handleChangeValue(optionList[0])

    optionList.map((option, index) => {
        const optionCreated = createOption(option, index)
        listbox.appendChild(optionCreated)
    })

    const optionsElem = [...document.querySelectorAll('.option')]
    
    listbox.addEventListener('mouseover', () => {
        optionsElem.forEach(option => option.classList.remove('option-focused'))
    })

    selectLabel.addEventListener('click', () => {
        isSelectOpen(select) ? closeSelect(select) : openSelect(select)
    })
    
    select.addEventListener('click', ({ target }) => {
        isSelectOpen(target) ? closeSelect(target) : openSelect(target)
    })
    
    select.addEventListener('keydown', ({target, key}) => {
        handleKeyboardAction(key, target)
    })
    
    select.addEventListener('blur', (event) => {
        if(event.relatedTarget && event.relatedTarget.id === 'option-list') {
            return
        }
        closeSelect(event.target) 
    })
})


