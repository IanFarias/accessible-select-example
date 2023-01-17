
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


/*
 aria-expanded -> utilizado para dizer se o combobox está aberto ou não

 aria-controls="option-list" -> indica que o elemento controla a lista de options

 tabindex = 0 -> para tornar o combobox focavel por tab

 aria-labelledby="select-label" -> para fazer o vinculo com a label do combobox. Ao focar no elemento sera lida a label

 role=combobox -> para indicar para o leitor de telas que o elemento é um combobox

 [ importante! ] aria-activedescendant -> para fazer o controle do foco das options utilizando a navegação por setas.
 Recebe o Id da option que o usuario está, para avisar o leitor de telas.

 role=listbox -> para indicar para o leitor de telas que se trata de uma lista de options de um combobox

 role=option -> para indicar para o leitor de tela que a <li> é uma option de um combobox

 aria-selected=[boolean] -> para dizer se a option está selecionada ou não

 tabindex= -5 -> utilizado no container das options para não deixar navegar por tab e nem por setas nelas. Deixando esse controle para o combobox.
*/

function createOption(optionName, index) {
    const option =  document.createElement('li')
    option.id = `${BASE_ID + index}`
    option.innerText = optionName
    option.classList.add('option')
    option.setAttribute('role', 'option')
    option.setAttribute('aria-selected', `${index === 0 ? 'true' : 'false'}`)
    
    option.addEventListener('click', ({target}) => {
        setSelectOption(target)
        closeSelect(select, listbox)
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

function openSelect(target, relatedTarget) {
    target.setAttribute('aria-expanded', 'true')
    relatedTarget.setAttribute('aria-expanded', 'true')
    focusedOption = 'option-0'
    target.setAttribute('aria-activedescendant', focusedOption);
}

function closeSelect(target, relatedTarget) {
    target.setAttribute('aria-expanded', 'false')
    relatedTarget.setAttribute('aria-expanded', 'false')
    focusedOption = 'option-0'
}

function handleOpenSelected({key, inputSelect}) {
    const currentIndex = parseInt(focusedOption.split('-')[1]) 

    if(CLOSE_KEYS.includes(key)) {
        closeSelect(inputSelect, listbox)
        return
    }

    if(key === NAVIGATION_KEYS.down) {
        const next = Math.min(maxIndex, currentIndex + 1);
        
        inputSelect.setAttribute('aria-activedescendant', `${BASE_ID + next}`)
        focusedOption = `${BASE_ID + next}`
        handleOptionFocus(inputSelect.getAttribute('aria-activedescendant'))
        return
    } 

    if(key === NAVIGATION_KEYS.up) {
        const previous = Math.max(0, currentIndex - 1);
        inputSelect.setAttribute('aria-activedescendant', `${BASE_ID + previous}`)
        focusedOption = `${BASE_ID + previous}`
        handleOptionFocus(inputSelect.getAttribute('aria-activedescendant'))
        return
    }

    setSelectOption(getSelectedOption(focusedOption))
    closeSelect(inputSelect, listbox)
}

function getSelectedOption(id) {
    const selectedOption = document.querySelector(`#${id}`)

    return selectedOption
}

function handleOptionFocus(id) {
    const previousOption = document.querySelector('li.option-focused')
    const currentOption = document.querySelector(`#${id}`)

    if(previousOption) {
        previousOption.classList.remove('option-focused')
    }
    
    currentOption.classList.add('option-focused')
}

function handleKeyboardAction(key, target) {
    if(OPEN_KEYS.includes(key) && !isSelectOpen(target)) {
        openSelect(target, listbox)
        handleOptionFocus(target.getAttribute('aria-activedescendant'))
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
        isSelectOpen(select) ? closeSelect(select, listbox) : openSelect(select, listbox)
    })
    
    select.addEventListener('click', ({ target }) => {
        isSelectOpen(target) ? closeSelect(target, listbox) : openSelect(target, listbox)
    })
    
    select.addEventListener('keydown', ({target, key}) => {
        handleKeyboardAction(key, target)
    })
    
    select.addEventListener('blur', (event) => {
        if(event.relatedTarget && event.relatedTarget.id === 'option-list') {
            return
        }
        closeSelect(event.target, listbox) 
    })
})


