
/*Este modulo é capaz de renderizar uma pagina para so depois conseguir ler, isto é interessando quando é um site que precisamos renderizar uma pagina
para realizar um login ou ataualizar por exemplo, por baixo dos banos ele utiliza o Chomiun*/
const puppeteer = require('puppeteer')


// Ler a página do instagram

async function star() {

    //Função responsavel por clicar no botão
    async function loadMore(page, selector) {
        const moreButton = await page.$(selector)

        if (moreButton) {
            console.log('Cliquei no botão')
            await moreButton.click()
            await page.waitFor(selector, { timeout: 5000 }).catch(() => {console.log('timeout')})
            await loadMore(page, selector)
        }


    }

    // Pegar os comentarios / arrobas

    async function getCommentarios(page, selector) {
        //com dois $$ eu informo que eu pegar todos não somente um, e com eval eu consigo passar um função na qual que posso tratar estes dados antes de retornar
        const comentarios = await page.$$eval(selector, links => links.map(link => link.innerText))//Retorna somente o texto do seletor
        return comentarios
    }

    //quando uma função é await é necessario que a função seja async 
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CFK5i3QA616/');

    //Clica no botão mais comentarios ate não haver mais comentarios
    const seletorButton = '.dCJp8'
    const seletorComentarios = '.C4VMK span a' //Pega todos os span e 'a' -> links filhos do C4VMK

    await loadMore(page, seletorButton)
    const comentariosArrobas = await getCommentarios(page,seletorComentarios)
    const counted = count(comentariosArrobas)
    const sorted = sort(counted)
    sorted.forEach(arroba => {console.log(arroba)})

    console.log()

    console.log(comentarios)

    await browser.close()
}

// Contar arrobas repetidas
function count(arrobas) {
    const contador = {}

    arrobas.forEach(arroba => {
        contador[arroba] = (contador[arroba] || 0) + 1
    });
    return contador
}

// Ordenar

function sort(counted) {

    /* Podemos utilizar o for como no exemplo a baixo para dar o push no array entries ou utilizar a classe Objetc
    como no exemplo apos o comentario.
    const entries = []
    
    for (prop in counted) {
        entries.push([prop, counted[prop]])
    }
    // console.log(entries)

    const sorted = entries.sort((a, b) => b[1] - a[1])
    //A função sorte pega dois elementos 'a' e 'b' 
    //que é feita a subritação  de dois elementos e este resultado define qual é o proximo elemento.
    //colocamos b[1] por que queremos ordenar pelo segundo elemento do array 
    */

    const entries = Object.entries(counted)
    const sorted = entries.sort((a, b) => b[1] - a[1])
    return sorted;
}


// sort(count(fakeArrobas))

star()
