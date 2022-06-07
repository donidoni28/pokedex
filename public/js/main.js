let app = document.getElementById('app')
let select = document.createElement('select')
let DefOption = document.createElement('option')

let controlContainer = document.createElement('div')
controlContainer.id = 'control-container'
let previous = document.createElement('p')
let next = document.createElement('p')
let indexOfPokemons = document.createElement('p')

let lengthOfArr

let description = document.createElement('p')
description.id = 'description'

let pokemonContainer = document.createElement('div')
pokemonContainer.id = 'pokemon-container'
let pokeName = document.createElement('h1')
let poids = document.createElement('p')
let taille = document.createElement('p')
let img = document.createElement('img')
let label = document.createElement('label')
let types = document.createElement('ul')
let type1 = document.createElement('li')
let type2 = document.createElement('li')

DefOption.innerText = 'regions pokemon'
DefOption.value = 'default'
select.appendChild(DefOption)
app.appendChild(select)
app.appendChild(controlContainer)
app.appendChild(pokemonContainer)

previous.innerText = '<'
previous.id = 'previous'
next.innerText = '>'
next.id = 'next'
indexOfPokemons.id = 'number'

select.addEventListener('change', (e) => {
    let indexOption = e.target.options.selectedIndex
    indexOfPokemons.innerText = 1
    fetchRegion(`https://pokeapi.co/api/v2/region/${indexOption}/`)
})

async function fetchType(url, i) {
    let response = await fetch(url)
    let responseData = await response.json()
    if (response.ok) {
        responseData.names.forEach(el => {
            if (el.language.name === 'fr') {
                if (i === 0) {
                    type1.innerText = el.name
                    type1.id = 'type1'
                } else {
                    type2.innerText = el.name
                    type2.id = 'type2'   
                }
            }
        })
    }
}

async function fetchpokemon(url) {
    let response = await fetch(url)
    let responseData = await response.json()
    
    if (response.ok) {
        poids.innerHTML = `poids: ${responseData.weight / 10} kg`
        taille.innerHTML = `taille: ${responseData.height / 10} m`
        poids.id = 'poids'
        taille.id = 'taille'

        pokemonContainer.appendChild(poids)
        pokemonContainer.appendChild(taille)
        img.setAttribute('src', `${responseData.sprites.other['official-artwork'].front_default}`)
        img.style.width = '100px'
        img.style.height = '100px'
        pokemonContainer.appendChild(img)
        label.innerText = 'types'
        label.setAttribute('for', 'types')
        label.setAttribute('name', 'types')
        pokemonContainer.appendChild(label)
        pokemonContainer.appendChild(types)
        types.appendChild(type1)
        responseData.types.forEach((el, i) => {
            fetchType(el.type.url, i)
        })
        if( responseData.types.length < 2 ){
            if(types.contains(type2)){
                type2.innerText = ''
                types.removeChild(type2)
            }
        } else {
            types.appendChild(type2)
        }
    }
}

async function fetchPokemonSpecies(url) {
    let response = await fetch(url)
    let responseData = await response.json()
    if (response.ok) {
        responseData.flavor_text_entries.forEach(el => {
            if (el.language.name === 'fr' && el.version.name === 'lets-go-pikachu') {
                description.innerHTML = el.flavor_text
                description.setAttribute('class', 'description')
                app.appendChild(description)
            }
        })
        responseData.names.forEach(el => {
            if (el.language.name === 'fr') {
                pokeName.innerText = el.name
                pokeName.id = 'name'
                pokemonContainer.appendChild(pokeName)
            }
        })
        responseData.varieties.forEach(el => {
            if (el.is_default === true) {
                fetchpokemon(el.pokemon.url)
            }
        })
    }
}

async function fetchPokedex(url) {
    let response = await fetch(url)
    let responseData = await response.json()
    if (response.ok) {
        let pokemons = responseData.pokemon_entries
        let pokemonUrl = pokemons[indexOfPokemons.innerText - 1].pokemon_species.url

        lengthOfArr = pokemons.length

        controlContainer.appendChild(previous)
        pokemonContainer.appendChild(indexOfPokemons)
        controlContainer.appendChild(next)
        fetchPokemonSpecies(pokemonUrl)

        previous.addEventListener('click', (e) => {            
            if (indexOfPokemons.innerText > 1) {
                indexOfPokemons.innerText--
                pokemonUrl = pokemons[indexOfPokemons.innerText - 1].pokemon_species.url
                fetchPokemonSpecies(pokemonUrl)
            }
        })

        next.addEventListener('click', (e) => {            
            if (indexOfPokemons.innerText < +lengthOfArr) {
                indexOfPokemons.innerText++
                pokemonUrl = pokemons[indexOfPokemons.innerText - 1].pokemon_species.url
                fetchPokemonSpecies(pokemonUrl)
            }
        })
    }
}

async function fetchRegion(url) {
    let response = await fetch(url)
    let responseData = await response.json()

    if (response.ok) {
        let selectedRegion = responseData
        fetchPokedex(selectedRegion.pokedexes[0].url)
    }
}

(
    async () => {
        let response = await fetch('https://pokeapi.co/api/v2/region/')
        let responseData = await response.json()

        if (response.status === 200) {
            let regions = responseData.results

            regions.forEach((region, i) => {
                let regionName = document.createElement('option')
                regionName.value = `${i + 1}`
                regionName.innerText = `${region.name}`
                select.appendChild(regionName)
            })

        }
    }
)()

